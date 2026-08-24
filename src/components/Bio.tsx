import type { Profile } from '../types';
import { ContactIcons } from './ContactIcons';
import { ProfilePhoto } from './ProfilePhoto';

interface BioProps {
  profile: Profile;
}

export function Bio({ profile }: BioProps) {
  return (
    <div className="mb-10 flex flex-col items-start gap-7 sm:flex-row">
      <div className="shrink-0">
        <ProfilePhoto photos={profile.photos} alt={profile.nameEn} />
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold">
          {profile.nameEn}{' '}
          <span className="font-normal text-slate-600 dark:text-slate-300">
            {profile.nameZh}
          </span>
        </h1>
        <p className="mt-3 leading-relaxed">{profile.bio}</p>
        <div className="mt-4">
          <ContactIcons contacts={profile.contacts} />
        </div>
      </div>
    </div>
  );
}
