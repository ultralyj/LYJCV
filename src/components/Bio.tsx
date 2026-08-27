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
          <h1 className="profile-name-row">
            <span className="name-en">{profile.nameEn}</span>{' '}
            <span className="name-cn">{profile.nameZh}</span>
          </h1>
          {profile.bio.split(/<br\s*\/?>/i).map((para, i) => (
            <p
              key={i}
              className="profile-intro"
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
        </div>
        <ProfilePhoto photos={profile.photos} alt={profile.nameEn} />
      </div>
      <div className="profile-links-cell">
        <ContactIcons contacts={profile.contacts} />
      </div>
    </div>
  );
}
