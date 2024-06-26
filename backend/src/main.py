from typing_extensions import List
from fastapi import (
    Depends,
    FastAPI,
    HTTPException,
    status,
    UploadFile,
    Response,
    Request,
)
from fastapi.responses import RedirectResponse, FileResponse
from datetime import timedelta
from typing import Annotated, Optional
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates

from . import crud, models, schemas
from .database import engine
from .loader import ViteLoader
from .settings import settings
from .storage import file_store
import os


models.Base.metadata.create_all(bind=engine)
app = FastAPI(openapi_url=settings.openapi_url, docs_url=settings.docs_url)


origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173/*",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


templates = Jinja2Templates(directory="src/templates")


if settings.mode == "dev":
    static = os.path.abspath("../frontend/dist/")
    app.mount("/static", StaticFiles(directory="../frontend/"), name="static")
else:
    static = f"{os.path.dirname(os.path.abspath(__file__))}/../../frontend/dist/"
    app.mount(
        "/static",
        StaticFiles(directory=static),
        name="static",
    )


if settings.mode == "prod":
    vite_loader = ViteLoader()
    templates.env.globals["vite_asset"] = vite_loader.vite_asset


@app.exception_handler(404)
async def custom_404_handler(request, __):
    if request.url.path.startswith("/assets"):
        return FileResponse(f"{static}{request.url.path}")
    if any(request.url.path.startswith(x) for x in ["/dashboard", "/login", "signup"]):
        return RedirectResponse("/")

    if request.url.path == "/sw.js":
        return FileResponse(f"{static}/sw.js")

    if request.url.path.startswith("/workbox-"):
        return FileResponse(f"{static}{request.url.path}")
    return Response(status_code=404)


@app.get("/")
async def read_index(request: Request):
    return templates.TemplateResponse(
        request=request, name="dev.html", context={"is_dev": settings.mode == "dev"}
    )


# login/token route
@app.post("/token")
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(crud.get_db),
) -> schemas.Token:
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(days=30)
    access_token = crud.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return schemas.Token(access_token=access_token, token_type="bearer")


# User aka Lawyer routes
@app.post("/users/create", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(crud.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/get", response_model=schemas.User)
def read_current_user(
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.get_current_user(db, current_user)


@app.put("/users/update", response_model=schemas.User)
def update_user(
    user: schemas.UserUpdate,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.update_user(db=db, user=user, current_user=current_user)


@app.delete("/users/delete")
def delete_user(
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.delete_user(db=db, user=current_user)


# client routes
@app.post("/user/clients/create", response_model=schemas.Client)
def create_client(
    client: schemas.ClientCreate,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
) -> schemas.Client:
    return crud.create_client(db=db, client=client, user=current_user)


@app.get("/user/clients/get", response_model=List[schemas.Client])
def read_clients(
    skip: int = 0,
    limit: int = 100,
    name_like: Optional[str] = None,
    email_like: Optional[str] = None,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.get_clients(
        db,
        user=current_user,
        skip=skip,
        limit=limit,
        name_like=name_like,
        email_like=email_like,
    )


@app.get("/user/summary", response_model=schemas.ProfileInfo)
def read_user_summary(
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.get_info(db, user=current_user)


@app.get("/user/clients/get/{client_id}", response_model=schemas.Client)
def read_client(
    client_id: int,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.get_client(db, user=current_user, client_id=client_id)


@app.put("/user/clients/update/{client_id}", response_model=schemas.Client)
def update_client(
    client_id: int,
    client: schemas.ClientUpdate,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.update_client(db, user=current_user, client_id=client_id, client=client)


@app.delete("/user/clients/delete/{client_id}")
def delete_client(
    client_id: int,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.delete_client(db, user=current_user, client_id=client_id)


@app.post("/files/create", response_model=schemas.File)
def create_file(
    file: schemas.FileCreate,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.create_file(db=db, file=file, user=current_user)


@app.get("/files/get/{client_id}", response_model=List[schemas.File])
def get_files(
    client_id: int,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.get_files(db=db, user=current_user, client_id=client_id)


@app.get("/file/get/{file_id}", response_model=schemas.File)
def get_file(
    file_id: int,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.get_file(db=db, user=current_user, file_id=file_id)


@app.post("/files/attachments/create/{file_id}", response_model=schemas.Attachment)
def create_attachment(
    attachment: UploadFile,
    file_id: int,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):

    return crud.create_attachment(
        db=db, attachment=attachment, current_user=current_user, file_id=file_id
    )


@app.get("/files/attachments/get/{file_id}", response_model=List[schemas.Attachment])
def get_attachments(
    file_id: int,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):

    return [
        schemas.Attachment(
            id=a.id, url=a.url, attachment_name=file_store.load(a.url)[0]
        )
        for a in crud.get_attachments(db=db, user=current_user, file_id=file_id)
    ]


@app.get("/file/attachment/get/{attachment_id}", response_model=schemas.Attachment)
def get_attachment(
    attachment_id: int,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    at = crud.get_attachment(db=db, user=current_user, attachment_id=attachment_id)

    if not at:
        raise HTTPException(status_code=404, detail="Attachment not found")
    f_name, path = at

    return FileResponse(
        path=path, media_type="application/octet-stream", filename=f_name
    )


@app.post("/events/create", response_model=schemas.EventResponse)
def create_event(
    event: schemas.Event,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.create_event(db=db, event=event, user=current_user)


@app.post("/events/update", response_model=schemas.EventResponse)
def update_event(
    event: schemas.UpdateEvent,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.update_event(db=db, event=event, user=current_user)


@app.get("/events/get", response_model=List[schemas.EventResponse])
def get_events(
    client_id: int | None = None,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.get_events(db=db, user=current_user, client_id=client_id)


@app.delete("/events/delete/{event_id}")
def delete_event(
    event_id: int,
    current_user: models.User = Depends(crud.get_current_user),
    db: Session = Depends(crud.get_db),
):
    return crud.delete_event(db=db, user=current_user, event_id=event_id)
