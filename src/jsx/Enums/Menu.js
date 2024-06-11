export const MenuList = [
  // Admins
  {
    title: "Admins Management",
    classsChange: "mm-collapse",
    iconStyle: <i className="la la-user-shield"></i>,
    to: "admins",
    text: "admins",
  },
  // Rules
  {
    title: "Rules",
    classsChange: "mm-collapse",
    iconStyle: <i className="la la-shield"></i>,
    to: "rules",
    text: "rules",
  },

  // Home
  {
      title:'Home',
      text:'home',
      classsChange: 'mm-collapse',
      iconStyle: <i className="la la-slack" />,
      content : [
          {
              title:'Page',
              text:'page',
              to: 'home/page',
              rule: 'home',
          },
          {
              title:'Products',
              text:'products',
              to: 'home/products',
              rule: 'home',
          },
          {
              title: "Social Media",
              text: "social_media",
              to: "home/social",
              rule: "home",
            },
          {
            title: "Contact Us",
            text: "contact_us",
            to: "home/contact-us",
            rule: "home",
          },
          {
            title: "About Us",
            text: "about_us",
            to: "home/about-us",
            rule: "home",
          },
      ]
  },
  // MasterHN
  {
      title:'MasterHN',
      text:'masterHN',
      classsChange: 'mm-collapse',
      iconStyle: <i className="la la-simplybuilt" />,
      content : [
          {
              title:'Categories',
              text:'categories',
              to: 'masterHN/categories',
              rule: 'home',
          },
          {
              title:'Products',
              text:'products',
              to: 'masterHN/products',
              rule: 'home',
          }
      ]
  },
  // Social Media
  // {
  //   title: "Social Media",
  //   classsChange: "mm-collapse",
  //   iconStyle: <i className="la la-wrench"></i>,
  //   to: "home/social",
  //   text: "social_media",
  // },

  // <i className='la la-cubes'></i>,
  // <i className='la la-cube'></i>,
  // <i className="la la-slack" />,
  // <i className="flaticon-381-notepad" />,
  // <i className="la la-qrcode"></i>
  // <i className='la la-truck'></i>
  // <i className='la la-pie-chart'></i>
  // <i className='la la-dollar'></i>
  // <i className="la la-wrench" />
  // <i className="la la-simplybuilt" />
  // <i className='la la-bell'></i>
];
