const routes = (handler) => [
  {
    method: "POST",
    path: "/collaborations",
    handler: handler.postCollaborationHandler,
    options: {
      auth: "musicapp_jwt_strategy",
    },
  },
  {
    method: "DELETE",
    path: "/collaborations",
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: "musicapp_jwt_strategy",
    },
  },
];

module.exports = routes;
