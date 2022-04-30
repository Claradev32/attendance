
export async function postData(url = '', data='') {

  const response = await fetch(url, {
    method: 'POST', 
    credentials: 'same-origin', 
    body: JSON.stringify(data) 
  });

  return response.json(); 
}
