const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { User } = require("../Models/userSchema");
const DetailsFromToken = require("../controllers/helpsDetailsUserFromToken");
const { conversation } = require("../Models/conversationSchema");
const { Message } = require("../Models/messageSchema");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const onlineUser = new Set();
io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;
  const user = await DetailsFromToken(token);
  if (user?._id) {
    socket.join(user?._id.toString());
    onlineUser.add(user?._id?.toString());
    io.emit("onlineUser", Array.from(onlineUser));
    ////////////////////////////////
    socket.on("userId", async (userId) => {
      const details = await User.findById(userId).select("-password");
      const payload = {
        _id: details._id,
        name: details.name,
        email: details.email,
        profile_pic: details.profile_pic,
        online: onlineUser.has(userId),
      };
      socket.emit("inform-user", payload);
    });
    // {///////start previous message/////////}

    socket.on("previous-message", async (userIdMessage) => {
      const findConversationFirst = await conversation
        .findOne({
          $or: [
            { sender: user?._id, reciver: userIdMessage },
            {
              sender: userIdMessage,
              reciver: user?._id,
            },
          ],
        })
        .populate("messages");
      socket.emit("all-message", findConversationFirst?.messages || {});
    });

    // {///////end previous message/////////}

    ////////start new message///////////
    socket.on("new-message", async (data) => {
      let findConversation = await conversation.findOne({
        $or: [
          {
            sender: data?.sender,
            reciver: data?.reciver,
          },
          {
            sender: data?.reciver,
            reciver: data?.sender,
          },
        ],
      });
      if (!findConversation) {
        findConversation = await conversation.create({
          sender: data?.sender,
          reciver: data?.reciver,
        });
        await findConversation.save();
      }
      /////////////taman////////////
      const createMessage = await Message.create({
        text: data?.text,
        imageUrl: data?.imageUrl,
        videoUrl: data?.videoUrl,
        msgByUser: data?.msgByUser,

        seen: false,
      });

      const saveMessages = await createMessage.save();

      await conversation.updateOne(
        {
          _id: findConversation._id.toString(),
        },
        {
          $push: { messages: saveMessages?._id },
        }
      );

      const findNewConversion = await conversation
        .findOne({
          $or: [
            { sender: data?.sender, reciver: data?.reciver },
            { sender: data?.reciver, reciver: data?.sender },
          ],
        })
        .populate("messages");

      io.to(data?.sender).emit("all-message", findNewConversion.messages);
      io.to(data?.reciver).emit("all-message", findNewConversion.messages);
    });
    //////end new message////////

    // {//////start sidebar////////////}
    socket.on("sidebar", async (userIdSidebar) => {
      const findConversitionSidebar = await conversation
        .find({
          $or: [{ sender: userIdSidebar }, { reciver: userIdSidebar }],
        })
        .populate("sender")
        .populate("reciver")
        .populate("messages");

      const sendReciverConversion = findConversitionSidebar.map((conv) => {
        const countUnSeen = conv.messages.reduce(
          (prev, acceu) => prev + (acceu.seen ? 0 : 1),
          0
        );
        return {
          _id: conv?._id,
          sender: conv?.sender,
          reciver: conv?.reciver,
          lastmessage: conv.messages[conv.messages.length - 1],
          countUnSeenMessage: countUnSeen,
        };
      });
      // console.log("sendReciverConversion", sendReciverConversion);
      socket.emit("messageSlider", sendReciverConversion);
    });
  }
  //{//////////end siderbar/////////////}

  /////////disConnect///////////

  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    io.emit("onlineUser", Array.from(onlineUser));
    console.log("disconnected io");
  });
});
module.exports = {
  app,
  server,
};
