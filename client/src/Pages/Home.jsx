import React from "react";
import SuggestedUsers from "./SuggestUser";
import { useOutletContext } from "react-router-dom";
import BlogSection from "./BlogSection";

const Home = () => {
  const { user } = useOutletContext(); 
  console.log(user);

  return (
    <div className="grid grid-cols-6">
      <div className="col-span-4">
       
      <BlogSection user={user}/>
      </div>
      <div className="col-span-2">
        <SuggestedUsers user={user} />
      </div>
    </div>
  );
};

export default Home;
