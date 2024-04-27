# Standard Library
import json
from typing import ClassVar, Dict, Optional
from urllib.parse import urljoin

# Third Party Libraries
import jinja2


from dataclasses import dataclass
from .settings import Settings, settings


class ViteLoader(object):
    def __init__(self) -> None:
        self.settings: Settings = settings
        self.manifest = {}
        self.parse_manifest()

    def parse_manifest(self) -> None:
        """
        Read and parse the Vite manifest file.

        Raises:
            RuntimeError: if cannot load the file or JSON in file is malformed.
        """
        with open(self.settings.manifest_path, "r") as manifest_file:
            manifest_content = manifest_file.read()
            try:
                self.manifest = json.loads(manifest_content)
            except Exception:
                raise RuntimeError(
                    "Cannot read Vite manifest file at {path}".format(
                        path=self.settings.manifest_path,
                    )
                )

    def generate_script_tag(
        self, src: str, attrs: Optional[Dict[str, str]] = None
    ) -> str:
        """Generates an HTML script tag."""
        attrs_str = ""
        if attrs is not None:
            attrs_str = " ".join(
                [
                    '{key}="{value}"'.format(key=key, value=value)
                    for key, value in attrs.items()
                ]
            )

        return f'<script {attrs_str} src="{src}"></script>'

    def generate_stylesheet_tag(self, href: str) -> str:
        """
        Generates and HTML <link> stylesheet tag for CSS.

        Arguments:
            href {str} -- CSS file URL.

        Returns:
            str -- CSS link tag.
        """
        return '<link rel="stylesheet" href="{href}" />'.format(href=href)


    def generate_vite_asset(
        self, path: str, scripts_attrs: Optional[Dict[str, str]] = None
    ) -> str:
        """
        Generates all assets include tags for the file in argument.

        Returns:
            str -- All tags to import this asset in yout HTML page.
        """
        if path not in self.manifest:
            raise RuntimeError(
                f"Cannot find {path} in Vite manifest at {self.settings.manifest_path}"
            )

        tags = []
        manifest_entry: dict = self.manifest[path]
        if not scripts_attrs:
            scripts_attrs = {"type": "module", "async": "", "defer": ""}

        # Add dependent CSS

        if manifest_entry:
            if "css" in manifest_entry:
                for css_path in manifest_entry.get("css"):
                    tags.append(
                        self.generate_stylesheet_tag(urljoin(self.settings.static_url, css_path))
                    )

            # Add dependent "vendor"
            if "imports" in manifest_entry:
                for vendor_path in manifest_entry.get("imports"):
                    tags.append(
                        self.generate_vite_asset(vendor_path, scripts_attrs=scripts_attrs)
                    )

        # Add the script by itself
        tags.append(
            self.generate_script_tag(
                urljoin(self.settings.static_url, manifest_entry["file"]),
                attrs=scripts_attrs,
            )
        )

        return "\n".join(tags)

    def generate_all_assets(self) -> list[str]:
        assets = []

        for path in self.manifest:
            assets.append(self.generate_vite_asset(path))

        return assets


# def vite_hmr_client() -> jinja2.utils.markupsafe.Markup:
#     """
#     Generates the script tag for the Vite WS client for HMR.
#     Only used in development, in production this method returns
#     an empty string.
#
#     If react is enabled,
#     Returns:
#         str -- The script tag or an empty string.
#     """
#     tags: list = []
#     tags.append(ViteLoader().generate_vite_react_hmr())
#     tags.append(ViteLoader().generate_vite_ws_client())
#     return jinja2.utils.markupsafe.Markup("\n".join(tags))


    def vite_asset(
        self,
        path: str, scripts_attrs: Optional[Dict[str, str]] = None
    ) -> jinja2.utils.markupsafe.Markup:
        """
        Generates all assets include tags for the file in argument.
        Generates all scripts tags for this file and all its dependencies
        (JS and CSS) by reading the manifest file (for production only).
        In development Vite imports all dependencies by itself.
        Place this tag in <head> section of yout page
        (this function marks automaticaly <script> as "async" and "defer").

        Arguments:
            path {str} -- Path to a Vite asset to include.

        Keyword Arguments:
            scripts_attrs {Optional[Dict[str, str]]} -- Override attributes added to scripts tags. (default: {None})
            with_imports {bool} -- If generate assets for dependant assets of this one. (default: {True})

        Returns:
            str -- All tags to import this asset in yout HTML page.
        """
        return jinja2.utils.markupsafe.Markup(
            self.generate_vite_asset(path, scripts_attrs=scripts_attrs)
        )


    def vite_asset_url(self, path: str) -> str:
        """
        Generates only the URL of an asset managed by ViteJS.
        Warning, this function does not generate URLs for dependant assets.

        Arguments:
            path {str} -- Path to a Vite asset.

        Returns:
            [type] -- The URL of this asset.
        """

        return self.generate_vite_asset_url(path)
