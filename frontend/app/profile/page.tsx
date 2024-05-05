import MyProfile from '@/components/profile/profile'
import PrimarySearchAppBar from '@/components/navigation';
import React from 'react';

export default function Profile() {
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
  