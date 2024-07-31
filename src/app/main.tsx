"use client";
import { useState } from "react";
import Image from "next/image";
import { Button, Form, Input, notification } from "antd";
import type { NotificationArgsProps } from "antd";
import { useContext } from "react";
import { Context } from "./notificationProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { validator } from "@/utils/validator";

const regex = "/^(84|85)d{0,7}$/";

export default function Main() {
  const { openNotification } = useContext(Context);
  const searchParams = useSearchParams();
  const [loading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const params: any = {};

  searchParams.forEach((value: any, key: any) => {
    params[key] = value;
  });

  const onFinish = async (values: any) => {
    const { phonenumber } = values;
    setIsLoading(false);
    try {
      const response = await fetch("http://localhost:3333/c2b",{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          phoneNumber:phonenumber,
          amount: params.amount
        })
      }
      )
      const responseData = await response.json();

      if(responseData.responseData.output_ResponseCode === "INS-0"){
        openNotification({title:"Pagamento Sucedido",message:`O Número 258${phonenumber} acabou de efectuar o pagamento com sucesso!`, type:'success'});

        window.location.href = `http://localhost/moodle/educon/payment/gateway/mpesa/success.php?component=${params.component}&paymentarea=${params.paymentarea}&itemid=${params.itemid}&phone-number=${phonenumber}`;

        setIsLoading(false);

      }else{
        openNotification({title:"Pagamento Mal Sucedido",message:`Ocorreu um erro durante o pagamento! ${responseData.responseData.output_ResponseDesc} `, type:'error'});
        setIsLoading(false);
      }

    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <div className="flex flex-col items-center justify-center p-5  border shadow-sm rounded w-[388px]">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Detalhes do pagamento</h1>
          <p className="text-slate-600 text-sm">
            Introduza o seu número para poder efectuar o pagamento do curso.
          </p>
        </div>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          style={{ width: "100%" }}
        >
          <Form.Item
            label="Número de Telefone"
            name="phonenumber"
            className="mb-1"
            rules={[
              { required: true, message: "Insira um número" },
              {
                required: true,
                pattern: new RegExp("^(84|85)/*$"),
                message: "O número deve começar com 84 ou 85",
              },
            ]}
          >
            <Input addonBefore="+258" size="large" className="rounded-sm" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", height: 42 }}
              loading={loading}
              disabled={loading}
            >
              Pagar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
}
