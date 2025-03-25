import { BreadcrumbNavSkeleton } from "./_components/skeleton/breadcrumb-nav-skeleton";
import { AuthButtonsSkeleton } from "./_components/skeleton/auth-buttons-skeleton";
import { CreateFolderDialogSkeleton } from "./_components/skeleton/create-folder-dialog-skeleton";
import { FileUploadDropzoneDialogSkeleton } from "./_components/skeleton/file-upload-dropzone-dialog-skeleton";
import { TableHeaderSkeleton } from "./_components/skeleton/table-header-skeleton";
import { ItemRowSkeletonList } from "./_components/skeleton/item-row-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        {/* 複製相同的布局，但使用骨架屏 */}
        <header className="mb-6 flex items-center justify-between">
          <BreadcrumbNavSkeleton />
          <AuthButtonsSkeleton />
        </header>

        <div className="mb-4 flex justify-between">
          <CreateFolderDialogSkeleton />
          <FileUploadDropzoneDialogSkeleton />
        </div>
        <div className="rounded-lg bg-gray-800 shadow-xl">
          <div className="border-b bg-primary px-6 py-4">
            <TableHeaderSkeleton />
          </div>
          <ul className="bg-popover">
            <ItemRowSkeletonList count={3} />
          </ul>
        </div>
      </div>
    </div>
  );
}
