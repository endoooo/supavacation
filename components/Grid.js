import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import toast from "react-hot-toast";
import Card from "@/components/Card";
import { ExclamationIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Grid = ({ homes = [] }) => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (session?.user) {
        try {
          const { data: favoritedHomes } = await axios.get(
            `/api/user/favorites`
          );
          console.log(favoritedHomes);
          setFavorites(favoritedHomes);
        } catch (e) {
          setFavorites([]);
        }
      }
    })();
  }, [session?.user]);

  const isEmpty = homes.length === 0;

  const toggleFavorite = async (id, favorite) => {
    let toastId;
    try {
      toastId = toast.loading(
        favorite ? "Removing from favorites..." : "Adding to favorites"
      );
      let res;
      // Toggle favorite
      if (favorite) {
        res = await axios.delete(`/api/homes/${id}/favorite`);
      } else {
        res = await axios.put(`/api/homes/${id}/favorite`);
      }
      // Update toast
      toast.success(
        favorite ? "Successfully removed" : "Succesfully favorited",
        { id: toastId }
      );
      // Update favorites
      if (favorite) {
        setFavorites((favorites_) =>
          favorites_.filter((favorite_) => favorite_.id !== id)
        );
      } else {
        setFavorites((favorites_) => [...favorites_, res.data]);
      }
    } catch (e) {
      console.log(e);
      toast.error(
        favorite ? "Unable to remove from favorites" : "Unable to add favorite",
        { id: toastId }
      );
    }
  };

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map((home) => (
        <Card
          key={home.id}
          {...home}
          onClickFavorite={toggleFavorite}
          favorite={favorites.some(
            (favoritedHome) => favoritedHome.id === home.id
          )}
        />
      ))}
    </div>
  );
};

export default Grid;
