export const getUsers = async () =>
  await fetch('http://91.193.43.93:3000/users');

export const getCurrencies = async () =>
  await fetch('http://91.193.43.93:3000/currencies');

export const makeTransaction = async (data) =>
  await fetch('http://91.193.43.93:3000/transfers/make-transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      let error = new Error(res.statusText);
      error.response = res;
      throw error;
    }
  });
