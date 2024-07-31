"use client"
import type { NotificationArgsProps } from "antd";
import {notification} from 'antd'
import React from "react";
import {CircleCheck, CircleX} from 'lucide-react'

type NotificationPlacement = NotificationArgsProps['placement']

type notify = {
  message?:string;
  title?:string;
  type?:'success' | 'error'
}


export const Context = React.createContext<{
  openNotification: (args: notify) => void;
}>({
  openNotification: ({ title, message }: notify) => {},
});

const NotificationProvider =({children}:{children:React.ReactNode})=>{
  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({title,type, message}:notify) => {
    api.open({
      icon: type === 'success' ? <CircleCheck strokeWidth={1} className="text-[#4b2776]"/> : <CircleX strokeWidth={1} className="text-[#FF0000]"/>,
      message: `${title}`,
      description:`${message}`,
      placement: "bottomRight",
    });
  };

  return(
    <Context.Provider value={{openNotification}}>
      {contextHolder}
      <>
      {children}
      </>
    </Context.Provider>
  )
} 

export default NotificationProvider;