'use client';
import { useState, ReactElement, ReactNode } from 'react';

interface TabProps {
  title: string;
  children: ReactNode;
  disabled?: boolean;
}

const Tab = ({ children }: TabProps) => <div>{children}</div>;

interface TabsProps {
  children: ReactElement<TabProps>[];
}

const Tabs = ({ children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab Buttons */}
      <div className="h-[51px] flex justify-center border-grey-300 border-b border-t gap-x-6">
        {children.map((tab, index) => {
          const isDisabled = tab.props.disabled;
          return (
            <button
              key={index}
              onClick={() => {
                if (!isDisabled) {
                  setActiveTab(index);
                }
              }}
              disabled={isDisabled}
              className={`py-2 text-medium1 ${
                isDisabled
                  ? 'text-grey-700 border-b-4 border-transparent'
                  : activeTab === index
                  ? 'border-b-4 border-icons-active text-icons-active'
                  : 'border-b-4 border-transparent text-grey-700 hover:text-icons-hover'
              }`}
            >
              {tab.props.title}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">{children[activeTab]?.props.children}</div>
    </div>
  );
};

export { Tabs, Tab };
