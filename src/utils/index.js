const songsdb = ({ id, title, year, performer, genre, duration, albumId }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId,
});
const filterTitleSong = (song, title) =>
  song.title.toLowerCase().includes(title);
const filterPerformerSong = (song, performer) =>
  song.performer.toLowerCase().includes(performer);
module.exports = {
  songsdb,
  filterPerformerSong,
  filterTitleSong,
};
