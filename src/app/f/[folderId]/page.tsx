import DriveContents from "../../drive-content";
import {
  getAllParentsForFolder,
  getFiles,
  getFolders,
} from "@/server/db/queries";

export default async function GoogleDriveClone(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;

  const parseFolderId = parseInt(params.folderId);
  if (isNaN(parseFolderId)) {
    return <div>Invalid folder ID</div>;
  }

  const [folders, files, parents] = await Promise.all([
    getFolders(parseFolderId),
    getFiles(parseFolderId),
    getAllParentsForFolder(parseFolderId),
  ]);

  return <DriveContents folders={folders} files={files} parents={parents} />;
}
