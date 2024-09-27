import axios from "axios";

export default {
  name: "imgur",
  author: "Arjhil Dacayanan",
  cooldowns: 10,
  description: "Upload ảnh lên imgur",
  role: "member",
  aliases: ["uploadimage"],

  async execute({ api, event }) {
    const clientId = "fc9369e9aea767c";
    const client = axios.create({
      baseURL: "https://api.imgur.com/3/",
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
    });

    const uploadImage = async (url) => {
      return (
        await client.post("image", {
          image: url,
        })
      ).data.data.link;
    };

    const array = [];

    if (event.type !== "message_reply" || event.messageReply.attachments.length === 0) {
      return api.sendMessage("Please reply to the image you want to upload", event.threadID);
    }

    for (const { url } of event.messageReply.attachments) {
      try {
        const res = await uploadImage(url);
        array.push(res);
      } catch (err) {
        console.log(err);
      }
    }

    return api.sendMessage(`» Uploaded ${array.length} images successfully\nFailed: ${array.length - event.messageReply.attachments.length}\n» Image Links:\n${array.join("\n")}`, event.threadID);
  },
};
