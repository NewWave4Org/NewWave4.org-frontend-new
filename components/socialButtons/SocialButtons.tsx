'use client';
import IconButton from "../icons/IconButton";
import FacebookIcon from "../icons/social/FacebookIcon";
import InstagramIcon from "../icons/social/InstagramIcon";

const SocialButtons = () => {
  return (
    <div className='flex gap-x-2'>
      <IconButton
        onClick={() =>
          window.open(
            'https://www.facebook.com/profile.php?id=100068772616023',
          )
        }
      >
        <FacebookIcon />
      </IconButton>
      <IconButton
        onClick={() =>
          window.open(
            'https://www.instagram.com/newwavebrooklynschool?igsh=MXd3cXdwN3JzcGtuMQ==',
          )
        }
      >
        <InstagramIcon />
      </IconButton>
    </div>
  );
};

export default SocialButtons;