"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Col, Form, Input, notification, Row } from "antd";
import type { NotificationArgsProps } from "antd";
import { useContext } from "react";
import { Context } from "./notificationProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { validator } from "@/utils/validator";
import educom from "@/assets/img/AF_Educom_Logo.png";

const regex = "/^(84|85)d{0,7}$/";

export default function Home() {
  const { openNotification } = useContext(Context);
  const searchParams = useSearchParams();
  const [loading, setIsLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [form] = Form.useForm();

  const params: any = {};

  searchParams.forEach((value: any, key: any) => {
    params[key] = value;
  });

  const {
    amount,
    name,
    lastname,
    email,
    currency,
    paymentarea,
    itemid,
    component,
    address,
    cursename,
  } = params;
  form.setFieldValue("firstName", name);
  form.setFieldValue("lastName", lastname);

  const onFinish = async (values: any) => {
    const {
      amount,
      name,
      lastname,
      email,
      currency,
      paymentarea,
      itemid,
      component,
      address,
    } = params;
    console.log(
      "Executando ",
      amount,
      name,
      lastname,
      email,
      currency,
      paymentarea,
      itemid,
      component,
      address
    );
    const { phonenumber } = values;
    setIsLoading(false);
    try {
      const response = await fetch("http://localhost:3333/c2b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phonenumber,
          amount: params.amount,
        }),
      });
      const responseData = await response.json();

      if (responseData.responseData.output_ResponseCode === "INS-0") {
        openNotification({
          title: "Pagamento Sucedido",
          message: `O Número 258${phonenumber} acabou de efectuar o pagamento com sucesso!`,
          type: "success",
        });

        window.location.href = `http://localhost/moodle/educon/payment/gateway/mpesa/success.php?component=${params.component}&paymentarea=${params.paymentarea}&itemid=${params.itemid}&phone-number=${phonenumber}`;

        setIsLoading(false);
      } else {
        openNotification({
          title: "Pagamento Mal Sucedido",
          message: `Ocorreu um erro durante o pagamento! ${responseData.responseData.output_ResponseDesc} `,
          type: "error",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <main className="relative grid grid-cols-3 h-screen">
      <div className="bg-gray-100 col-span-2 px-32 py-12">
        <div className="flex flex-row items-center gap-2">
          <Image src={educom} alt="educom-payment" height={50} />
          <h1 className="font-semibold text-3xl">Checkout</h1>
        </div>
        <div className="my-8">
          <div className=" bg-white border rounded p-4">
            <h2 className="font-semibold mb-4">Detalhes de pagamento</h2>
            <div>
              <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                autoComplete="off"
                style={{ width: "100%" }}
              >
                <Form.Item label="Nome Completo">
                  <Row gutter={[12, 8]}>
                    <Col span={12}>
                      <Form.Item required name="firstName" className="mb-1">
                        <Input size="large" className="rounded-sm" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="lastName" className="mb-1">
                        <Input size="large" className="rounded-sm" disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label="Número de telefone">
                  <Row gutter={[12, 8]}>
                    <Col span={24}>
                      <Form.Item
                        name="phonenumber"
                        className="mb-1"
                        required
                        rules={[
                          { required: true, message: "Insira um número" },
                          {
                            required: true,
                            pattern: new RegExp("^(84|85)[0-9]{0,7}/*$"),
                            message: "O número deve começar com 84 ou 85",
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          className="rounded-sm"
                          addonBefore="+258"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{
                      flexGrow: 1,
                      width: "100%",
                      height: 42,
                      fontWeight: "semibold",
                      textTransform: "capitalize",
                      fontSize: 16,
                      background: "#22798C",
                      border: "none",
                      color: "#e5e5e5",
                      letterSpacing: 2,
                    }}
                  >
                    Efectuar o pagamento
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
        {/* <div className="grow w-full">
          <p className="text-center">Criado pela Comunika</p>
        </div> */}
      </div>
      <div className="flex flex-col bg-[#4b2776] py-12 pl-12 pr-32">
        <div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
              <h4 className="font-semibold text-xl text-white line-clamp-2">
                {cursename}
              </h4>
              <p className="font-light text-gray-200">{`${currency} ${amount}`}</p>
            </div>
            <div className="border-t border-b border-gray-600 py-2 my-8">
              <div className="flex flex-row items-center justify-between">
                <h4 className="font-semibold text-gray-400 text-2xl">
                  Subtotal
                </h4>
                <p className="font-light text-gray-300">{`${currency} ${amount}`}</p>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h4 className="font-semibold text-2xl text-gray-100">Total</h4>
              <p className="font-semibold text-gray-100">{`${currency} ${amount}`}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
