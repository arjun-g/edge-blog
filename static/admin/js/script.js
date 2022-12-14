function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

window.removeAllChildNodes = removeAllChildNodes;

const Category = {
  getAll: async () => {
    const resp = await fetch("/admin/api/category");
    return await resp.json();
  },
  create: async (category) => {
    await fetch("/admin/api/category", {
      method: "post",
      body: JSON.stringify(category),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  update: async (category) => {
    await fetch(`/admin/api/category/${category.ID}`, {
      method: "put",
      body: JSON.stringify(category),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  del: async (ID) => {
    await fetch(`/admin/api/category/${ID}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

window.Category = Category;

const Tag = {
  getAll: async () => {
    const resp = await fetch("/admin/api/tag");
    return await resp.json();
  }
};

const Link = {
  getAll: async () => {
    const resp = await fetch("/admin/api/link");
    return await resp.json();
  },
  create: async (link) => {
    await fetch("/admin/api/link", {
      method: "post",
      body: JSON.stringify(link),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  update: async (link) => {
    await fetch(`/admin/api/link/${link.ID}`, {
      method: "put",
      body: JSON.stringify(link),
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  del: async (ID) => {
    await fetch(`/admin/api/link/${ID}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

window.Link = Link;

const Post = {
  getAll: async () => {
    const req = await fetch("/admin/api/post");
    return await req.json();
  },
  get: async (ID) => {
    return await (await fetch(`/admin/api/post/${ID}`)).json();
  },
  create: async () => {
    const req = await fetch("/admin/api/post", {
      method: "post",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await req.json();
  },
  update: async (post) => {
    const resp = await fetch(`/admin/api/post/${post.ID}`, {
      method: "PUT",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await resp.json();
  },
  publish: async (ID) => {
    const resp = await fetch(`/admin/api/post/${ID}/publish`, {
      method: "PUT",
      body: JSON.stringify({ PublishedDate: new Date().getTime() }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await resp.json();
  },
  unpublish: async (ID) => {
    const resp = await fetch(`/admin/api/post/${ID}/unpublish`, {
      method: "PUT",
      body: JSON.stringify({ }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await resp.json();
  },
};

window.Post = Post;

async function getCategories() {
  const resp = await fetch("/admin/api/category");
  return await resp.json();
}

window.getCategories = getCategories;

const throttle = (callback, delay) => {
  let throttleTimeout = null;
  let storedEvent = null;

  const throttledEventHandler = (event) => {
    storedEvent = event;

    const shouldHandleEvent = !throttleTimeout;

    if (shouldHandleEvent) {
      callback(storedEvent);

      storedEvent = null;

      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;

        if (storedEvent) {
          throttledEventHandler(storedEvent);
        }
      }, delay);
    }
  };

  return throttledEventHandler;
};

window.throttle = throttle;

const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

window.debounce = debounce;

const { useState, useEffect } = React;
const {
  Breadcrumb,
  Layout,
  Menu,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Popover,
  Table: AntTable,
  Typography,
  Button,
  Space,
  Modal,
  Collapse,
  Col,
  Row,
  Checkbox,
  Select,
  message,
  Upload,
  Image: AntImage
} = antd;
const { Content, Footer, Sider } = Layout;
const {
  Html5Outlined,
  EditOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  InboxOutlined
} = icons;
const { BrowserRouter, Switch, Route, useHistory, useParams } = ReactRouterDOM;

function TopMenu() {
  let history = useHistory();
  return (
    <Menu mode="horizontal" theme="dark">
      <Menu.Item onClick={() => history.push("/admin")}>Posts</Menu.Item>
      <Menu.Item onClick={() => history.push("/admin/categories")}>
        Categories
      </Menu.Item>
      <Menu.Item onClick={() => history.push("/admin/links")}>Links</Menu.Item>
      <Menu.Item onClick={() => window.location.href = "/admin/auth/logout"}>
        Logout
      </Menu.Item>
    </Menu>
  );
}

function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) {
  let inputNode = <Text />;

  switch (inputType) {
    case "text":
      inputNode = <Input />;
      break;
    case "textarea":
      inputNode = <Input.TextArea />;
      break;
    case "number":
      inputNode = <InputNumber />;
      break;
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

function DataTable({
  columns,
  dataSource,
  onRowUpdate,
  onRowDelete,
  canDelete,
  canEdit,
  onRowEdit,
}) {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataSource);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    if (onRowEdit) {
      onRowEdit(record);
    } else {
      form.setFieldsValue({ ...record });
      setEditingKey(record.key);
    }
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        onRowUpdate({ ...item, ...row });
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
        console.log("SAVE 1", newData);
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
        console.log("SAVE 2", newData);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const currentColumns = [
    ...columns,
    {
      title: "Actions",
      dataIndex: "Actions",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            {canEdit && (
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
                style={{ marginRight: 8 }}
              >
                Edit
              </Typography.Link>
            )}
            {canDelete && (
              <Popconfirm
                title="Sure want to delete ?"
                onConfirm={() => {
                  onRowDelete(record);
                }}
              >
                <a>Delete</a>
              </Popconfirm>
            )}
          </span>
        );
      },
    },
  ];

  const mergedColumns = currentColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.type,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        fixed: "right",
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <AntTable
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
}

function PostsPage() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  function loadPosts() {
    setLoading(true);
    Post.getAll().then((result) => {
      setDataSource(result.posts);
      setLoading(false);
    });
  }
  useEffect(() => {
    loadPosts();
  }, []);
  return (
    <Content style={{ padding: "16px" }}>
      <h1>Posts</h1>
      <Content>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button type="primary" onClick={async () => {
            const { ID } = await Post.create();
            history.push(`/admin/posts/${ID}`);
          }}>
            New Post
          </Button>
          {!loading && (
            <DataTable
              dataSource={dataSource}
              columns={[
                {
                  title: "ID",
                  dataIndex: "ID",
                  type: "text",
                },
                {
                  title: "Title",
                  dataIndex: "Title",
                  type: "text",
                },
                {
                  title: "Modified On",
                  dataIndex: "ModifiedOn",
                  type: "text",
                },
                {
                  title: "Published On",
                  dataIndex: "PublishedDate",
                  type: "text",
                },
                {
                  title: "Excerpt",
                  dataIndex: "Excerpt",
                  width: "25%",
                  type: "text",
                },
              ]}
              onRowEdit={(item) => {
                history.push(`/admin/posts/${item.ID}`);
              }}
              canDelete={false}
              canEdit={true}
            />
          )}
        </Space>
      </Content>
    </Content>
  );
}

function Editor({
  data,
  onChange
}){
  useEffect(() => {
    const editor = new EditorJS({
      holder: "editor",
      tools: {
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: "/admin/api/media",
            },
          },
        },
        hyperlink: {
          class: Hyperlink,
          config: {
            target: "_blank",
            rel: "author",
            availableTargets: ["_blank", "_self"],
            availableRels: ["author", "noreferrer"],
            validate: false,
          },
        },
        carousel: {
          class: Carousel,
          config: {
              endpoints: {
                byFile: "/admin/api/media",
              }
          }
        },
        embed: Embed,
        quote: Quote,
        marker: Marker,
        code: CodeTool,
        link: LinkTool,
        delimiter: Delimiter,
        inlineCode: InlineCode,
        raw: RawTool,
        warning: Warning,
        table: Table,
      },
      data,
      onChange: () => {
        editor.save().then(async (outputData) => {
          onChange(outputData);
        }).catch((error) => {});
      }
    });
  }, []);
  return <div id="editor" />;
}

function PostPage() {
  const { ID } = useParams();
  const [post, setPost] = useState(null);
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [showNewCategory, setShowNewCategory] = useState(false);

  function loadCategories() {
    Category.getAll().then(categories => {
      setCategories(categories);
    });
  }

  function loadTags() {
    Tag.getAll().then(tags => {
      setTags(tags);
    })
  }

  useEffect(() => {
    Post.get(ID).then((post) => {
      setPost(post);
      setData(post.Data);
    });
    loadCategories();
    loadTags();
  }, []);
  return (post &&
    <Layout style={{ height: "100%" }}>
      <Layout>
        <Content style={{ padding: "16px", "overflow-y": "auto" }}>
          <div
            style={{
              width: "100%",
              "max-width": "900px",
              margin: "0 auto",
              background: "white",
            }}
          >
            {post && (
              <textarea className="title-editor" onInput={(e) => {
                post.Title = e.target.value;
                setPost({ ...post });
              }} value={post.Title} />
            )}
            <Editor data={post.Data} onChange={data => {
              setData(data);
            }} />
          </div>
        </Content>
      </Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="light"
        width="300"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        reverseArrow={true}
        style={{ "overflow-x": "hidden", "overflow-y": "auto" }}
      >
        <Content style={{ padding: "16px" }}>
          <Space wrap>
            {post.Status === 0 && <Button onClick={e => {
              e.preventDefault();
              post.Data = data;
              Post.update(post);
            }}>Save</Button>}
            {post.Status === 1 && <Button onClick={e => {
              e.preventDefault();
              Post.unpublish(ID)
              .then(() => Post.get(ID))
              .then((post) => {
                setPost(post);
              });
            }}>Move to draft</Button>}
            <Button onClick={e => {
              post.Data = data;
              Post.update(post)
              .then(() => {
                window.open(`/admin/posts/${ID}/preview`, "_blank");
              });
            }}>Preview</Button>
            <Button type="primary" onClick={e => {
              e.preventDefault();
              post.Data = data;
              Post.update(post)
              .then(() => Post.publish(ID))
              .then(() => Post.get(ID))
              .then((post) => {
                setPost(post);
              });
            }}>Publish</Button>
          </Space>
        </Content>
        <Collapse defaultActiveKey={["general", "banner"]}>
          <Collapse.Panel header="General" key="general">
            <Content style={{ "font-size": "12px" }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>Published On</Col>
                <Col span={16}>
                  {post.Status === 0 ? "Not Yet" : dayjs(post.PublishedDate).format("DD/MM/YYYY, HH:mm")}
                </Col>

                <Col span={8}>Permalink</Col>
                <Col span={16}>
                  <Popover trigger="click" content={<Form name="slug" initialValues={{ Slug: post.Slug }}  onFinish={values => {
                        console.log("FINISH", values);
                        post.Slug = values.Slug;
                        setPost({ ...post });
                      }}>
                      <Form.Item label="Slug" name="Slug" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit">Save</Button>
                      </Form.Item>
                    </Form>}>
                    <a href={`${window.location.origin}/posts/${post.Slug}`} style={{"word-break": "break-all"}}>{`${window.location.origin}/posts/${post.Slug}`}</a>
                  </Popover>
                </Col>
              </Row>
            </Content>
          </Collapse.Panel>
          <Collapse.Panel header="Excerpt">
            <Input.TextArea value={post.Excerpt} onInput={e => {
              post.Excerpt = e.target.value;
              setPost({ ...post });
            }} />
          </Collapse.Panel>
          <Collapse.Panel header="Categories" key="categories">
            <Checkbox.Group value={post.Categories.map(category => category.ID)} onChange={values => {
              console.log("VALUES", values);
              post.Categories = categories.filter(c => {
                return values.find(ID => ID === c.ID);
              });
              setPost({ ...post });
            }}>
              <Row>
                <Col>
                  {categories.map(category => <Row><Checkbox value={category.ID}>{category.Name}</Checkbox></Row>)}
                  <Row>
                    <Button type="link" onClick={(e) => {
                      e.preventDefault();
                      setShowNewCategory(true);
                    }}>+ Add Category</Button>
                  </Row>
                </Col>
              </Row>
            </Checkbox.Group>
            <NewCategoryModal open={showNewCategory} onClose={() => {
              loadCategories();
              setShowNewCategory(false);
            }} />
          </Collapse.Panel>
          <Collapse.Panel header="Tags" key="tags">
            <Row>
              <Col span={24}>
                <Select mode="tags" options={tags.map(tag => {
                  return { value: tag.Tag, label: `#${tag.Tag}` };
                })} style={{ width: "100%" }} value={post.Tags.map(tag => {
                  return { value: tag.Tag, label: `#${tag.Tag}` }
                })} onChange={values => {
                  post.Tags = values.map(value => {
                    return { Tag: value, Content: "" };
                  });
                  setPost({ ...post });
                }} />
              </Col>
            </Row>
          </Collapse.Panel>
          <Collapse.Panel header="Banner" key="banner">
            {post.BannerID && <AntImage src={`/media/${post.BannerID}`} />}
            <Upload.Dragger name="image" multiple={false} action="/admin/api/media" onChange={info => {
              console.log("INFO", info);
              const { file } = info;
              if (file.status === "done") {
                post.BannerID = file.response.id;
                setPost({ ...post });
              }
            }} onDrop={e => {
              console.log("DROP", e);
            }} showUploadList={false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Upload.Dragger>

          </Collapse.Panel>
        </Collapse>
      </Sider>
    </Layout>
  );
}

function MediaPage() {
  return <div>Media</div>;
}

function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  function loadCategories() {
    setLoading(true);
    Category.getAll().then((categories) => {
      setDataSource(
        categories.map((category) => {
          category.key = category.ID;
          return category;
        })
      );
      setLoading(false);
    });
  }
  useEffect(() => {
    loadCategories();
  }, []);
  return (
    <Content style={{ padding: "16px" }}>
      <h1>Categories</h1>
      <Content>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="primary"
            onClick={() => {
              setShowNewCategory(true);
            }}
          >
            New Category
          </Button>
          {!loading && (
            <DataTable
              dataSource={dataSource}
              columns={[
                {
                  title: "ID",
                  dataIndex: "ID",
                  width: "15%",
                  type: "text",
                  editable: false,
                },
                {
                  title: "Name",
                  dataIndex: "Name",
                  width: "25%",
                  type: "text",
                  editable: true,
                },
                {
                  title: "Content",
                  dataIndex: "Content",
                  type: "textarea",
                  editable: true,
                },
              ]}
              onRowDelete={(item) => {
                console.log("DELETE ITEM", item);
                Category.del(item.ID).then(() => {
                  loadCategories();
                });
              }}
              onRowUpdate={(item) => {
                Category.update(item).then(() => {
                  loadCategories();
                });
              }}
              canEdit={true}
              canDelete={true}
            />
          )}
        </Space>
      </Content>
      <NewCategoryModal open={showNewCategory} onClose={() => {
        loadCategories();
        setShowNewCategory(false);
      }} />
    </Content>
  );
}

function NewCategoryModal({
  onClose,
  open
}) {
  return <Modal
    title="New Category"
    open={open}
    onClose={onClose}
    footer={null}
  >
    <Form
      layout="vertical"
      onFinish={(values) => {
        Category.create(values).then(() => {
          onClose();
        });
      }}
    >
      <Form.Item label="ID" name="ID" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Name" name="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Content" name="Content">
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Space align="end">
          <Button
            htmlType="cancel"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Space>
      </Form.Item>
    </Form>
  </Modal>;
}

function LinksPage() {
  const [loading, setLoading] = useState(true);
  const [showNewLink, setShowNewLink] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  function loadLinks() {
    setLoading(true);
    Link.getAll().then((links) => {
      setDataSource(
        links.map((link) => {
          link.key = link.ID;
          return link;
        })
      );
      setLoading(false);
    });
  }
  useEffect(() => {
    loadLinks();
  }, []);
  return (
    <Content style={{ padding: "16px" }}>
      <h1>Links</h1>
      <Content>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            type="primary"
            onClick={() => {
              setShowNewLink(true);
            }}
          >
            New Link
          </Button>
          {!loading && (
            <DataTable
              dataSource={dataSource}
              columns={[
                {
                  title: "ID",
                  dataIndex: "ID",
                  width: "15%",
                  type: "text",
                  editable: false,
                },
                {
                  title: "Title",
                  dataIndex: "Title",
                  width: "25%",
                  type: "text",
                  editable: true,
                },
                {
                  title: "URL",
                  dataIndex: "URL",
                  type: "text",
                  editable: true,
                },
                {
                  title: "Order",
                  dataIndex: "Order",
                  type: "number",
                  editable: true,
                },
              ]}
              onRowDelete={(item) => {
                console.log("DELETE ITEM", item);
                Link.del(item.ID).then(() => {
                  loadLinks();
                });
              }}
              onRowUpdate={(item) => {
                Link.update(item).then(() => {
                  loadLinks();
                });
              }}
              canEdit={true}
              canDelete={true}
            />
          )}
        </Space>
      </Content>
      <Modal
        title="New Link"
        open={showNewLink}
        onClose={() => {
          setShowNewCategory(false);
        }}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={(values) => {
            Link.create(values).then(() => {
              loadLinks();
            });
            setShowNewLink(false);
          }}
        >
          <Form.Item label="Title" name="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="URL" name="URL" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Order" name="Order" rules={[{ required: true }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item>
            <Space align="end">
              <Button
                htmlType="cancel"
                onClick={() => {
                  setShowNewLink(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Layout.Header
          style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}
        >
          <TopMenu />
        </Layout.Header>
        <Content className="site-layout">
          <Switch>
            <Route exact path="/admin">
              <PostsPage />
            </Route>
            <Route exact path="/admin/posts/:ID">
              <PostPage />
            </Route>
            <Route exact path="/admin/media">
              <MediaPage />
            </Route>
            <Route exact path="/admin/categories">
              <CategoriesPage />
            </Route>
            <Route exact path="/admin/links">
              <LinksPage />
            </Route>
          </Switch>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

ReactDOM.render(<App />, document.querySelector("#frame"));
