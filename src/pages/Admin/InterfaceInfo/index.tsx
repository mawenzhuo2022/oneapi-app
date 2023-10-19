import { addRule, removeRule,  updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST
} from "@/services/oneapi/interfaceInfoController";
import type { SortOrder } from 'antd/es/table/interface';
import CreateModal from "@/pages/Admin/InterfaceInfo/components/CreateModal";
import UpdateModal from "@/pages/Admin/InterfaceInfo/components/UpdateModal";





const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('Adding...');
    try {
      await addInterfaceInfoUsingPOST({
        ...fields,
      });
      hide();
      message.success('Added successfully');
      handleModalVisible(false);
      return true;
    } catch (error: any) {
      hide();
      message.error('Added failed，' + error.message);
      return false;
    }
  };
  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields:  API.InterfaceInfo) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('Modifing');
    try {
      await updateInterfaceInfoUsingPOST({
        id: currentRow.id,
        ...fields
      });
      hide();
      message.success('Modified successfully');
      return true;
    } catch (error: any) {
      hide();
      message.error('Modified failed，' + error.message);
      return false;
    }
  };
  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('Deleting');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('Deleted successfully');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('Deleted failed，' + error.message);
      return false;
    }
  };
  /**
   * 下线接口
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('Offlining');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('Offlined successfully');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('Offlined Released' + error.message);
      return false;
    }
  };


  /**
   * 发布接口
   *
   * @param record
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('Releasing');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPOST({
        id: record.id
      });
      hide();
      message.success('Released Released');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('Released failed，' + error.message);
      return false;
    }
  };
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',

    },
    {
      title: (
        <FormattedMessage
          id="pages.InterfaceInfoTable.name"
          defaultMessage="Name"
        />
      ),
      dataIndex: 'name',
      valueType: 'text',

    },
    {
      title: <FormattedMessage
        id="pages.InterfaceInfoTable.description"
        defaultMessage="Desc" />,
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: (
        <FormattedMessage
          id="pages.InterfaceInfoTable.method"
          defaultMessage="Method"
        />
      ),
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: (
        <FormattedMessage
          id="pages.InterfaceInfoTable.url"
          defaultMessage="Url"
        />
      ),
      dataIndex: 'url',
      valueType: 'text',

    },
    {
      title: (
        <FormattedMessage
          id="pages.InterfaceInfoTable.requestParams"
          defaultMessage="RequestParams"
        />
      ),
      dataIndex: 'requestParams',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.InterfaceInfoTable.requestHeader"
          defaultMessage="RequestHeader"
        />
      ),
      dataIndex: 'requestHeader',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.InterfaceInfoTable.responseHeader"
          defaultMessage="ResponseHeader"
        />
      ),
      dataIndex: 'responseHeader',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.InterfaceInfoTable.status" defaultMessage="Status" />,
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: 'OFF',
          status: 'Default',
        },
        1: {
          text: 'ON',
          status: 'Processing',
        },
      },
    },
    {
      title: 'CreateTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: 'UpdateTime',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.InterfaceInfoTable.option" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.InterfaceInfoTable.modify" defaultMessage="Modify" />
        </a>,

        record.status === 0 ? <a
          key="config"
          onClick={() => {
            handleOnline(record);
          }}
        >
          <FormattedMessage id="pages.InterfaceInfoTable.release" defaultMessage="Release" />
        </a> : null,
        record.status === 1 ? <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            handleOffline(record);
          }}
        >
          Off-line
        </Button> : null,
        <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            handleRemove(record);
          }}
        >
          <FormattedMessage id="pages.InterfaceInfoTable.delete" defaultMessage="Delete" />
        </Button>,
      ],
    },
  ];


  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (
          params,
          sort: Record<string, SortOrder>,
          filter: Record<string, React.ReactText[] | null>,
        ) => {
          const res: any = await listInterfaceInfoByPageUsingGET({
            ...params,
          });
          if (res?.data) {
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal
        columns={columns}
        onCancel={() => {
          handleModalVisible(false);
        }}
        onSubmit={(values) => {
          handleAdd(values);
        }}
        visible={createModalVisible}
      />
    </PageContainer>
  );
};

export default TableList;
