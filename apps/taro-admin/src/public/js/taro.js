async function commitMedia(id) {
  try {
    const body = {
      mediaIds: [id],
    };
    const url = `${media_api_url}/media/commit`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        version: '1',
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const dataJSON = await res.json();
    if (!res.ok) throw dataJSON;
    window.location.reload();
    return;
  } catch (error) {
    const { message } = error;
    alert(message);
    return;
  }
}

async function deleteMedia(id) {
  try {
    const body = {
      mediaIds: [id],
    };
    const url = `${media_api_url}/media/drop`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        version: '1',
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const dataJSON = await res.json();
    if (!res.ok) throw dataJSON;
    window.location.reload();
    return;
  } catch (error) {
    const { message } = error;
    alert(message);
    return;
  }
}
