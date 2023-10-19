import { PageContainer } from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';
import {Button, Card, Descriptions, Form, message, Input, Spin, Divider} from 'antd';
import {
  getInterfaceInfoByIdUsingGET,
  invokeInterfaceInfoUsingPOST,
} from '@/services/oneapi/interfaceInfoController';
import { useParams } from '@@/exports';

/**
 * Interface info
 * @constructor
 */
const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

  const params = useParams();

  const loadData = async () => {
    if (!params.id) {
      message.error('Params is not exist.');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoByIdUsingGET({
        id: Number(params.id),
      });
      setData(res.data);
    } catch (error: any) {
      message.error('Requested failed，' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('API is not exist.');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPOST({
        id: params.id,
        ...values,
      });
      setInvokeRes(res.data);
      message.success('Requested successfully');
    } catch (error: any) {
      message.error('Requested failed' + error.message);
    }
    setInvokeLoading(false);
  };

  return (
    <PageContainer title="View API Document">
      <Card>
        {data ? (
          <Descriptions title={data.name} column={1}>
            <Descriptions.Item label="Status">{data.status ? 'ON' : 'OFF'}</Descriptions.Item>
            <Descriptions.Item label="Des">{data.description}</Descriptions.Item>
            <Descriptions.Item label="Url">{data.url}</Descriptions.Item>
            <Descriptions.Item label="Meth">{data.method}</Descriptions.Item>
            <Descriptions.Item label="Request Params">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="Request Header">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="Response Header">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="Create Time">{data.createTime}</Descriptions.Item>
            <Descriptions.Item label="Update Time">{data.updateTime}</Descriptions.Item>
          </Descriptions>
        ) : (
          <>API is not exist.</>
        )}
      </Card>
      <Divider />
      <Card title="Online Test">
        <Form name="invoke" layout="vertical" onFinish={onFinish}>
          <Form.Item label="Request Params" name="userRequestParams">
            <Input.TextArea />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              Test
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="Return" loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
