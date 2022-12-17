export function getUserID() {
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let user_id = params.get('user_id');
  if (!user_id) window.location.replace(process.env.REACT_APP_LOGIN_URL || '');

  return user_id;
}
