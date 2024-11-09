import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER } from './GetUser';
import { GET_POST } from './GetPost';
import { GET_POSTS } from './GetPosts';
import { UPDATE_POST } from './UpdatePost';
import { CREATE_POST } from './CreatePost';
import { DELETE_POST } from './DeletePost';
import './user.css'
const User = () => {
    const [userId, setUserId] = useState("");
    const [postId, setPostId] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [titleCreate, setTitleCreate] = useState('');
    const [bodyCreate, setBodyCreate] = useState('');
    const [deletePostt, setDeletePost] = useState('');

    const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER, {
        variables: { id: userId ? parseInt(userId, 10) : null },
        skip: !userId,
    });

    const { loading: postLoading, error: postError, data: postData } = useQuery(GET_POST, {
        variables: { id: postId ? parseInt(postId, 10) : null },
        skip: !postId,
    });

    const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_POSTS, {
        variables: {
            options: {
                paginate: { page: 1, limit: 10 },
            },
        },
        skip: !userId,
    });

    const [updatePost, { loading: loadingUpdate, error: errorUpdate }] = useMutation(UPDATE_POST);
    const [createPost, { loading: loadingCreate, error: errorCreate }] = useMutation(CREATE_POST);
    const [deletePost, { loading: loadingDelete, error: errorDelete }] = useMutation(DELETE_POST);

    const handleChange = (e) => {
        const value = e.target.value;
        if (value === '' || (!isNaN(value) && parseInt(value, 10) > 0)) {
            setUserId(value === '' ? '' : parseInt(value, 10));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await updatePost({
                variables: { id: postId, title, body },
            });
            alert(`Post with ID ${data.updatePost.id} updated successfully!`);
        } catch (err) {
            console.error('Error updating post:', err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await createPost({
                variables: { title: titleCreate, body: bodyCreate },
            });
            alert(`Post with ID ${data.createPost.id} created successfully!`);
            setTitleCreate('');
            setBodyCreate('');
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!deletePostt) {
            alert("Please provide a valid post ID to delete.");
            return;
        }

        try {
            const { data } = await deletePost({
                variables: {
                    id: deletePostt,
                },
            });
            alert(`Post with ID ${data.deletePost.id} deleted successfully!`);
            setDeletePost('');
        } catch (err) {
            console.error('Error deleting post:', err);
        }
    };

    if (userLoading || postLoading || postsLoading || loadingUpdate || loadingCreate || loadingDelete) {
        return <p>Loading...</p>;
    }

    if (userError || postError || postsError || errorUpdate || errorCreate || errorDelete) {
        return <p>Error occurred: {userError?.message || postError?.message || postsError?.message || errorUpdate?.message || errorCreate?.message || errorDelete?.message}</p>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>User and Post Information</h2>

            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>User ID:</strong>
                    <input
                        type="number"
                        value={userId}
                        onChange={handleChange}
                        placeholder="Enter User ID"
                        min="1"
                        style={{
                            marginLeft: '10px',
                            padding: '5px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                        }}
                    />
                </label>
            </div>

            {userData?.user && (
                <div className='userData'>
                    <p><strong>ID:</strong> {userData.user.id}</p>
                    <p><strong>Name:</strong> {userData.user.name}</p>
                    <p><strong>Username:</strong> {userData.user.username}</p>
                    <p><strong>Email:</strong> {userData.user.email}</p>
                </div>
            )}

            {postData?.post && (
                <div className='postData'>
                    <h3>Post Details</h3>
                    <p><strong>ID:</strong> {postData.post.id}</p>
                    <p><strong>Title:</strong> {postData.post.title}</p>
                    <p><strong>Body:</strong> {postData.post.body}</p>
                </div>
            )}

            <form onSubmit={handleUpdate} className='updata'>
                <div>
                    <label>Post ID:</label>
                    <input type="text" value={postId} onChange={(e) => setPostId(e.target.value)} />
                </div>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Body:</label>
                    <textarea value={body} onChange={(e) => setBody(e.target.value)} />
                </div>
                <button type="submit" disabled={loadingUpdate}>Update Post</button>
            </form>

            <form onSubmit={handleCreate} className='create'>
                <div className='item'>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={titleCreate}
                        onChange={(e) => setTitleCreate(e.target.value)}
                    />
                </div>
                <div className='item'>
                    <label>Body:</label>
                    <textarea
                        value={bodyCreate}
                        onChange={(e) => setBodyCreate(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loadingCreate}>
                    {loadingCreate ? 'Creating...' : 'Create Post'}
                </button>
            </form>

            {/* Delete Post */}
            <div style={{ marginTop: '20px' }} className='delete'>
                <label>Post ID to Delete:</label>
                <input
                    type="text"
                    value={deletePostt}
                    onChange={(e) => setDeletePost(e.target.value)}
                    style={{ marginLeft: '10px' }}
                />
                <button onClick={handleDelete} disabled={!deletePostt || loadingDelete}>
                    {loadingDelete ? 'Deleting...' : 'Delete Post'}
                </button>
            </div>

            {/* All Posts */}
            {postsData?.posts?.data?.length > 0 ? (
                <div>
                    <h3>All Posts</h3>
                    <ul>
                        {postsData.posts.data.map((post) => (
                            <li key={post.id}>
                                <strong>{post.title}</strong>
                            </li>
                        ))}
                    </ul>
                    <p>Total Posts: {postsData.posts.meta.totalCount}</p>
                </div>
            ) : (
                <p>No posts available.</p>
            )}
        </div>
    );
};

export default User;
