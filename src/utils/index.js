/* eslint-disable key-spacing */
/* eslint-disable camelcase */
const mapSongs = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = {
  mapSongs,
};
