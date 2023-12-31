import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import PhotosUploader from "../PhotosUploader";
import PerksComponent from "../perks";
import { useEffect, useState } from "react";
import axios from "axios";

//places input form to register places
export default function PlacesFormPage() {
  //places fields
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }

    //api integration
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn ? data.checkIn.slice(0, 10) : "");
      setCheckOut(data.checkOut ? data.checkOut.slice(0, 10) : "");
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);
  function inputHeader(text, isBold) {
    const headerClass = isBold ? "font-bold text-2xl mt-4" : "text-2xl mt-4";
    return <h2 className={headerClass}>{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      //update
      await axios.put("/places/", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      //new place
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput("Title", "Title For your place should be short and catchy")}
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title"
        />

        {preInput("Address", "Address to this place")}
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="address"
        />

        {preInput("Photos", "Upload photos to showcase your place")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        {preInput("Description", "Description of the place")}
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        {preInput("Perks", "Select all the perks of your place")}

        <div className="grid mt-2 gap-2 grid-col-2 md:grid-cols-3 lg:grid-cols-6">
          <PerksComponent selected={perks} onChange={setPerks} />
        </div>
        {preInput("Extra Info", "Extra features")}

        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
        />
        {preInput("Check in & out times", "add check in and out times")}

        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 mb-1">Check in Date</h3>
            <input
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              className="border p-4 flex rounded-2xl"
            />
          </div>
          <div className="mt-2 mb-1">
            <h3>Check out Date</h3>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              className="border p-4 flex rounded-2xl"
            />
          </div>
          <div className="mt-2 mb-1 ">
            <h3>Max number of guest</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              className="border p-4 flex rounded-2xl"
              min="1"
            />
          </div>
          <div className="mt-2 mb-1 ">
            <h3>Price per night</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              className="border p-4 flex rounded-2xl"
              min="1"
            />
          </div>
        </div>
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
}
