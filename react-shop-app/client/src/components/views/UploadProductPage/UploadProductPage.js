import React, { useState } from 'react'
import { Typography, Button, Form, Input } from 'antd';    // antd Button-Form 작동 X
import FileUpload from '../../utils/FileUpload';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const Continents = [
    { key: 1, value: "Africa" },
    { key: 2, value: "Europe" },
    { key: 3, value: "Asia" },
    { key: 4, value: "North America" },
    { key: 5, value: "South America" },
    { key: 6, value: "Austrailia" },
    { key: 7, value: "Antarctica" },
]

function UploadProductPage(props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [continent, setContinent] = useState(1);
    const [images, setImages] = useState([]);

    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }

    const priceChangeHandler = (event) => {
        setPrice(event.currentTarget.value)
    }

    const continentChangeHandler = (event) => {
        setContinent(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if (!title || !description || !price || !continent || !images) {
            return alert("모든 값을 넣어주셔야 합니다.")
        }

        // 폼에 입력한 값들을 서버에 request로 보낸다.
        const body = {
            // 로그인한 사람의 ID
            writer: props.user.userData._id,
            title: title,
            description: description,
            price: price,
            continents: continent,
            images: images
        }

        axios.post('/api/product', body)
            .then(response => {
                if (response.data.success) {
                    alert("상품 업로드에 성공했습니다.")
                    props.history.push('/')
                } else {
                    alert("상품 업로드에 실패했습니다")
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>여행 상품 업로드</Title>
            </div>
            <form onSubmit={submitHandler}>
                {/* DropZone */}
                <FileUpload refreshFunction={updateImages} />

                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={title} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={description} />
                <br />
                <br />
                <label>가격($)</label>
                <Input onChange={priceChangeHandler} value={price} />
                <br />
                <br />
                <select onChange={continentChangeHandler} value={continent}>
                    {Continents.map(item => (
                        <option key={item.key} value={item.key}> {item.value} </option>
                    ))}
                </select>
                <br />
                <br />
                <button type="submit">
                    확인
                </button>
            </form>
        </div>
    )
}

export default UploadProductPage
