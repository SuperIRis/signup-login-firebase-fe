export function resetPassword(data) {
  console.log('reset to', data.password);
  return Promise.resolve({ status: 'success' });
}
