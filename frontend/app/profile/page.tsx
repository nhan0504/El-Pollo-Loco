'use client'
import MyProfile from '@/components/profile/profile'
import PrimarySearchAppBar from '@/components/navigation';
import React from 'react';
import { useState, useEffect } from 'react';

export default function Profile() {

  const [windowLoaded, setWindowLoaded] = useState(false);

  useEffect(() => {
    setWindowLoaded(true);    
  },[])

  const getProfile = () => {
    return (
      <main>
        <div>
          <PrimarySearchAppBar />
          <br />
          <MyProfile/>
        </div>
      </main>
    );
  }

  if(windowLoaded)
    return getProfile();
  }
  