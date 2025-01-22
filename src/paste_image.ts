import content, {content_cursor_position, image_bed} from "./content";

document.addEventListener("paste", async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (!items) return;

  for (const item of items) {
    if (item.type.startsWith("image/")) {
      const blob = item.getAsFile();
      if (blob) {
        console.log("Image blob:", blob);

        // log url
        const blob_url = URL.createObjectURL(blob);
        console.log("Image URL:", blob_url);

        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });

        const file_id = blob_url.split("/").pop();

        const url = `smartflow://image/${file_id}`;

        image_bed.set(url, base64);

        // insert image
        const start = content_cursor_position.value;
        const end = start + 1;

        let newContent = `\n![image](${url})\n`;

        if (content.value.slice(start - 1, start) != "\n") {
          newContent = "\n" + newContent;
        }

        if (content.value.slice(end, end + 1) != "\n") {
          newContent = newContent + "\n";
        }

        content.value = content.value.slice(0, start) + newContent + content.value.slice(end);
      }
    }
  }
});
