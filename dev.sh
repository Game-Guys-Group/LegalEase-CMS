#!/bin/env bash

# Function to create virtual environment if not exists
create_virtualenv() {
    if [ ! -d "backend/env" ]; then
        echo "Creating virtual environment..."
        python3 -m venv backend/env
        echo "Virtual environment created."
    else
        echo "Virtual environment already exists."
    fi
}

# Function to activate the virtual environment
activate_virtualenv() {
    if [ "$ENABLE_VENV" = "true" ]; then
        source backend/env/bin/activate
        echo "Virtual environment activated."
    else
        echo "Skipping virtual environment activation."
    fi
}

# Function to download dependencies
download_deps() {
    cd backend
    pip install -r requirements.txt
    echo "Backend dependencies downloaded."
    cd ../frontend
    npm install
    echo "Frontend dependencies downloaded."
    cd ..
}

# Function to start frontend
start_frontend() {
    cd frontend
    npm run dev &
    echo "Frontend started."
		cd ..
}

# Function to build frontend for production
build_frontend() {
    cd frontend
    npm run build
    echo "Frontend built for production."
    cd ..
}

# Function to start backend
start_backend() {
    cd backend
    uvicorn src.main:app --reload &
    echo "Backend started."
    cd ..
}

# Function to run in production mode
run_production() {
    export MODE="prod"
		export OPENAPI_URL=""

    activate_virtualenv
    download_deps
    build_frontend
    start_backend
    echo "Server running in production mode."
}

# Main function to manage dev and production environments
main() {
    case "$1" in
        "run_dev")
            create_virtualenv
            activate_virtualenv
            download_deps
            start_frontend
            start_backend
            echo "Press Ctrl+C to stop"
            # wait for Ctrl+C
            sleep 999d
            trap "exit" INT TERM
            trap "kill 0" EXIT
            ;;
        "download_deps")
            create_virtualenv
            activate_virtualenv
            download_deps
            ;;
        "run_prod")
            create_virtualenv
            activate_virtualenv
            run_production
            ;;
        *)
            echo "Usage: $0 {run_dev|download_deps|run_prod}"
            exit 1
            ;;
    esac
}

main "$@"
