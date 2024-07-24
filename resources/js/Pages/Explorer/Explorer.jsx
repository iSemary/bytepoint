import React, { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import { ChonkyActions, FullFileBrowser, setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import axiosConfig from "../../configs/AxiosConfig";

export default function Explorer() {
    setChonkyDefaults({ iconComponent: ChonkyIconFA });

    const customFileActions = [
        ChonkyActions.DownloadFiles,
        ChonkyActions.DeleteFiles,
    ];

    const [files, setFiles] = useState([]);
    const [folderChain, setFolderChain] = useState([]);
    const [subPath, setSubPath] = useState("");

    useEffect(() => {
        fetchFiles(subPath);
    }, [subPath]);

    const fetchFiles = (path) => {
        axiosConfig
            .get("explorer", { params: { path: path } })
            .then((response) => {
                setFiles(response.data.data.files);
                setFolderChain(response.data.data.folder_chain);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleFileAction = (data) => {
        console.log(data);
        if (data.action.id === ChonkyActions.OpenFiles.id) {
            const { targetFile, files } = data.payload;
            const fileToOpen = targetFile ?? files[0];
            if (fileToOpen && fileToOpen.isDir) {
                setSubPath((prevPath) =>
                    prevPath
                        ? `${prevPath}/${fileToOpen.name}`
                        : fileToOpen.name
                );
            }
        } else if (data.action.id === ChonkyActions.MouseClickFile.id) {
            const { file, altKey } = data.payload;
            if (altKey && file.isDir) {
                goToParentDirectory();
            }
        }
    };

    const goToParentDirectory = () => {
        setSubPath((prevPath) => {
            const pathParts = prevPath.split('/');
            pathParts.pop();
            return pathParts.join('/');
        });
    };

    const links = [
        { label: "Home", href: "/", icon: "home" },
        { label: "File Manager", href: "/file-manager", icon: "file_manager" },
    ];

    return (
        <Layout links={links} title="File Manager">
            <FullFileBrowser
                darkMode
                files={files}
                folderChain={folderChain}
                fileActions={customFileActions}
                onFileAction={handleFileAction}
            />
        </Layout>
    );
}