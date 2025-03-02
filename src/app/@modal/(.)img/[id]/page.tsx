import { Modal } from "./modal";
import { FullPageImageView } from "@/common/full-page-image-view";
import { QUERIES } from "@/server/db/queries";

export default async function PhotoModal(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  //TODO: use safty parse
  const idAsNumber = Number(params.id);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid photo id");
  const image = await QUERIES.getImage(idAsNumber);

  if (!image) throw new Error("Image not found");

  return (
    <Modal>
      <FullPageImageView image={image} />
    </Modal>
  );
}
