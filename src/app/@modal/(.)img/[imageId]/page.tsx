import { Modal } from "./modal";
import { FullPageImageView } from "@/common/full-page-image-view";
import { QUERIES } from "@/server/db/queries";

export default async function PhotoModal(props: {
  params: Promise<{ imageId: string }>;
}) {
  const params = await props.params;
  //TODO: use safty parse
  const idAsNumber = Number(params.imageId);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo id");
  const image = await QUERIES.getFile(idAsNumber);

  if (!image)
    return (
      <Modal>
        <FullPageImageView image={null} />
      </Modal>
    );

  return (
    <Modal>
      <FullPageImageView image={image} />
    </Modal>
  );
}
