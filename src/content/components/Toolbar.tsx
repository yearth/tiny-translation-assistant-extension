import React from "react";

interface ToolbarProps {
  onTranslate: () => void;
  onReadAloud: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onTranslate, onReadAloud }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-2 min-w-[300px]">
      <ul className="flex items-center space-x-2" role="menu">
        <li
          className="flex items-center px-2 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded cursor-pointer"
          role="menuitem"
          onClick={onTranslate}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path
              d="M8.80005 2.80005H10.8C12.1255 2.80005 13.2 3.87457 13.2 5.20005V6.40005M7.20005 13.2H5.20005C3.87457 13.2 2.80005 12.1255 2.80005 10.8V8.80005"
              stroke="#1A2029"
              strokeWidth="1.2"
            ></path>
            <path
              d="M7.57195 8.7488C6.96715 8.5424 6.43195 8.324 5.96635 8.0936C5.50555 7.868 5.09515 7.616 4.73515 7.3376C4.38955 7.6064 3.98875 7.856 3.53275 8.0864C3.07675 8.3168 2.54875 8.5424 1.94875 8.7632L1.38715 7.7552C1.94875 7.5776 2.43835 7.3976 2.85595 7.2152C3.27355 7.0328 3.63835 6.836 3.95035 6.6248C3.65275 6.2888 3.39595 5.9144 3.17995 5.5016C2.96395 5.084 2.77915 4.6112 2.62555 4.0832H1.68235V3.1184H4.21675L4.05115 2.2904L5.14555 2.24C5.19355 2.4896 5.24395 2.7824 5.29675 3.1184H7.75195V4.0832H6.77995C6.63595 4.616 6.45835 5.0912 6.24715 5.5088C6.04075 5.9264 5.78875 6.3032 5.49115 6.6392C6.12955 7.0664 6.97675 7.4192 8.03275 7.6976L7.57195 8.7488ZM3.69115 4.0832C3.90235 4.8464 4.24315 5.4776 4.71355 5.9768C4.94395 5.7272 5.13835 5.4488 5.29675 5.1416C5.45515 4.8344 5.58715 4.4816 5.69275 4.0832H3.69115Z"
              fill="#1A2029"
            ></path>
            <path
              d="M12.424 11.824H10.168L9.68802 13.2H8.42402L10.496 7.64795H12.128L14.184 13.2H12.896L12.424 11.824ZM12.072 10.816L11.352 8.71195H11.256L10.52 10.816H12.072Z"
              fill="#1A2029"
            ></path>
          </svg>
          <span>翻译</span>
        </li>

        <li
          className="flex items-center px-2 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded cursor-pointer"
          role="menuitem"
          onClick={onReadAloud}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <path
              d="M8 2.5V13.5"
              stroke="#1A2029"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M12.5 5.5V10.5"
              stroke="#1A2029"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M3.5 5.5V10.5"
              stroke="#1A2029"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span>朗读</span>
        </li>

        <li
          className="flex items-center px-2 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded cursor-pointer ml-auto"
          role="menuitem"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 1.5L6.5 6.5"
              stroke="#1A2029"
              strokeLinecap="round"
            ></path>
            <path
              d="M6.5 1.5L1.5 6.5"
              stroke="#1A2029"
              strokeLinecap="round"
            ></path>
          </svg>
        </li>
      </ul>
    </div>
  );
};

export default Toolbar;
