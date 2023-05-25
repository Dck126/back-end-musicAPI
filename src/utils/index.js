const songsdb = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  username,
  name,
  owner,
  playlist_id,
  song_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  username,
  name,
  owner,
  playlistId: playlist_id,
  songId: song_id,
});

const filterTitleSong = (song, title) =>
  song.title.toLowerCase().includes(title);
const filterPerformerSong = (song, performer) =>
  song.performer.toLowerCase().includes(performer);

// const filterPlaylistName = (playlist, name) =>
//   playlist.name.toLowerCase().includes(name);
// const filterUserUsername = (user, username) =>
//   user.username.toLowerCase().includes(username);

module.exports = {
  songsdb,
  filterPerformerSong,
  filterTitleSong,
};
