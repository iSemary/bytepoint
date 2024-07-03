import React from "react";
import Layout from "../../Layout/Layout";
import { ChonkyActions, FullFileBrowser, setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";

export default function Explorer() {
    setChonkyDefaults({ iconComponent: ChonkyIconFA });

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "File Manager", href: "/file-manager", icon: "file_manager" },
    ];

    const files = [
        { id: "lht", name: "Projects", isDir: true },
        {
            id: "mcd",
            name: "chonky-sphere-v2.png",
            thumbnailUrl: "https://chonky.io/chonky-sphere-v2.png",
        },
    ];

    const folderChain = [{ id: "xcv", name: "Demo", isDir: true }];

    const customFileActions = [
        ChonkyActions.DownloadFiles,
        ChonkyActions.DeleteFiles,
    ];

    return (
        <Layout links={links} title="File Manager">
            <FullFileBrowser
                files={files}
                folderChain={folderChain}
                fileActions={customFileActions}
            />
        </Layout>
    );
}
