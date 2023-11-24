import stables from "@/constants/stables";

const revalidatePage = async () => {
  const url = `${stables.BASE_URL}/revalidate-data`;
  const options = {
    method: 'GET'
  }
  const RES = await fetch(url, options);
}

export const updateRevalidate = async (reloadPage = true) => {
  const url = `${stables.BASE_URL}/api/revalidate/update`;
  const options = {
    method: 'PUT'
  }
  const RES = await fetch(url, options);
  const DATA = await RES.json();
  if(reloadPage){
    await revalidatePage();
  }
}