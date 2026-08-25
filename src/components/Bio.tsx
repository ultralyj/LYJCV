import type { Profile } from '../types';
import { ContactIcons } from './ContactIcons';
import { ProfilePhoto } from './ProfilePhoto';

interface BioProps {
  profile: Profile;
}

export function Bio({ profile }: BioProps) {
  return (
    <div className="profile-hero">
      <div className="profile-hero-row">
        <div className="profile-text-col">
          <p className="profile-name-row">
            <span className="name-en">{profile.nameEn}</span>{' '}
            <span className="name-cn">{profile.nameZh}</span>
          </p>
          <p className="profile-intro">{profile.bio}</p>
        </div>
        <ProfilePhoto photos={profile.photos} alt={profile.nameEn} />
      </div>
      <div className="profile-links-cell">
        <ContactIcons contacts={profile.contacts} />
      </div>
    </div>
  );
}
