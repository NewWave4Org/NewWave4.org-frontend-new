import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FacebookIcon from '../icons/social/FacebookIcon';

const MemberTeaser = ({ member }: { member: Member }) => {
  return (
    <div className="member-teaser text-center max-w-[180px] rounded-lg font-helv">
      <Image src={member.img} alt={member.name} width={180} height={301} />
      <div className="info bg-grey-50 pt-3 min-h-[160px] max-w-[180px] relative rounded-b-lg">
        <div className="name mb-1 text-primary text-base font-medium">
          {member.name}
        </div>
        <div className="location text-sm text-grey-500 font-normal">
          {member.location}
        </div>
        <div className="position mt-2 mb-[21px] text-primary-500 font-medium">
          {member.position}
        </div>
        <div className="social text-left">
          <div className="p-3 rounded-lg shadow-custom bg-grey-100 inline-block absolute left-0 bottom-0">
            <Link target="_blank" href={member.social.facebook}>
              <FacebookIcon size="22" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberTeaser;
