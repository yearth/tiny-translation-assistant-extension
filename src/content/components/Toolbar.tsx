import React from "react";

interface ToolbarProps {
  selectedText?: string;
  onTranslate: () => void;
  onReadAloud: () => void;
  onAddToWordbook: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onTranslate,
  onReadAloud,
  onAddToWordbook,
}) => {
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
          className="flex items-center px-2 py-1 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded cursor-pointer"
          role="menuitem"
          onClick={onAddToWordbook}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1"
          >
            <g>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.34847 4.56092C3.76126 4.34386 4.50379 4.03677 5.37713 4.03677C6.25047 4.03677 6.993 4.34386 7.40579 4.56092C7.43151 4.57444 7.4728 4.61576 7.47597 4.70378C7.47594 4.70742 7.47592 4.71107 7.47592 4.71472V11.8574C6.94956 11.6367 6.21802 11.419 5.37713 11.419C4.53258 11.419 3.80008 11.6387 3.2781 11.8575V4.71466C3.2781 4.61913 3.32171 4.57499 3.34847 4.56092ZM8.04545 13.197C7.86352 13.2428 7.6645 13.2245 7.49112 13.1283C7.10489 12.9139 6.31728 12.558 5.37713 12.558C4.6923 12.558 4.08636 12.7469 3.65403 12.9356C3.30882 13.0863 2.9381 13.0312 2.6624 12.8701C2.38376 12.7074 2.13904 12.3959 2.13904 11.9834V4.71466C2.13904 4.26334 2.3611 3.79317 2.81834 3.55274C3.31945 3.28924 4.2496 2.89771 5.37713 2.89771C6.50466 2.89771 7.43481 3.28924 7.93592 3.55274C7.97412 3.57282 8.01067 3.59451 8.0456 3.61766C8.08041 3.59459 8.11686 3.57298 8.15493 3.55295C8.48437 3.3797 8.9916 3.15513 9.61437 3.01899C9.92166 2.95182 10.2252 3.14647 10.2924 3.45375C10.3596 3.76104 10.1649 4.0646 9.85763 4.13177C9.36048 4.24046 8.95074 4.42141 8.68512 4.5611C8.65958 4.57453 8.61835 4.61557 8.61518 4.70378C8.61521 4.70741 8.61522 4.71103 8.61522 4.71465V11.8575C9.14158 11.6368 9.87312 11.419 10.714 11.419C11.5586 11.419 12.2911 11.6387 12.813 11.8576V7.10187C12.813 6.78733 13.068 6.53234 13.3826 6.53234C13.6971 6.53234 13.9521 6.78733 13.9521 7.10187V11.9835C13.9521 12.396 13.7074 12.7074 13.4287 12.8702C13.153 13.0312 12.7823 13.0863 12.4371 12.9356C12.0048 12.7469 11.3988 12.5581 10.714 12.5581C9.77387 12.5581 8.98625 12.9139 8.60003 13.1283C8.42657 13.2246 8.22745 13.2429 8.04545 13.197Z"
                fill="#1A2029"
              ></path>
            </g>
          </svg>
          <span>记入单词本</span>
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
