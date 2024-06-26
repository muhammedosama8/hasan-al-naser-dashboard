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
          },
          {
              title:'Style Up',
              text:'style_up',
              to: 'masterHN/style-up',
              rule: 'home',
          },
          {
              title:'Variant',
              text:'variant',
              to: 'variant',
              rule: 'home',
          },
          {
              title:'Dynamic Variant',
              text:'dynamic_variant',
              to: 'dynamic-variant',
              rule: 'home',
          },
          {
            title:'Orders',
            text:'orders',
            to: 'orders',
            rule: 'home',
          },
          {
            title:'Notification',
            text:'notification',
            to: 'notification',
            rule: 'home',
          },
          {
            title:"Promo Codes",
            text:'promo_codes',
            to: 'promo-codes',
            rule: 'home',
          },
          {
            title:'Banners',
            text:'banners',
            to: 'banners',
            rule: 'home',
          },{
            title: "Delivery",
            text: "delivery",
            to: "delivery",
            rule: "home",
          },
          {
            title: "Social Media",
            text: "social_media",
            to: "social",
            rule: "home",
          },
          {
            title: "Currency",
            text: "currency",
            to: "currency",
            rule: "home",
          },
          {
            title: "Payment",
            text: "payment",
            to: "payment",
            rule: "home",
          },
          {
            title: "Pages",
            text: "pages",
            to: "pages",
            rule: "home",
          },
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
