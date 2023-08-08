import React from 'react';
import { Button, Form, Input, message, Radio, Checkbox } from 'antd';
import Imgsubmit from './imgsubmit.png';

import {
  useNavigate,
} from 'react-router-dom';

function UpdateQuiz ({ token }) {
  const navigate = useNavigate()
  const currentUrl = window.location.href;
  const parts = currentUrl.split('/');
  const updateQuizId = parts.pop();
  const [quizUpdateInputlist, setQuizUpdateInputlist] = React.useState([]);
  const [questionInputNewName, setQuestionInputNewName] = React.useState('');
  const [imageLocal, setImageLocal] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');

  const handleFileImageChange = (event) => {
    const file = event.target.files[0];
    const inputUrl = event.target.value;

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
        if (file.type.includes('image')) {
          setImageLocal(base64String);
        }
      };
    } else if (inputUrl) {
      if (inputUrl.match(/\.(mp4|ogg|webm)$/) != null) {
        setVideoUrl(inputUrl);
      } else if (inputUrl.match(/\.(jpeg|jpg|gif|png)$/) != null) {
        setImageUrl(inputUrl);
      }
    }
  };

  const handleQuestionInputChange = (index, value) => {
    const newQuestions = [...quizUpdateInputlist];
    newQuestions[index].question = value;
    setQuizUpdateInputlist(newQuestions);
  };

  const handleAddQuestion = (type) => {
    const newQuestion = {
      question: '',
      answers: type === 'short' ? '' : ['', '', '', ''],
      correctAnswer: type === 'short' ? '' : [],
      type,
    };
    setQuizUpdateInputlist([...quizUpdateInputlist, newQuestion]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...quizUpdateInputlist];
    newQuestions.splice(index, 1);
    setQuizUpdateInputlist(newQuestions);
  };

  const handleAnswerInputChange = (questionIndex, answerIndex, value) => {
    const newQuestions = [...quizUpdateInputlist];
    const newAnswers = [...newQuestions[questionIndex].answers];
    newAnswers[answerIndex] = value.toString();
    newQuestions[questionIndex].answers = newAnswers;
    setQuizUpdateInputlist(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, value) => {
    const newQuestions = [...quizUpdateInputlist];
    const question = newQuestions[questionIndex];
    if (question.type === 'single') {
      question.correctAnswer = value.toString();
    } else if (question.type === 'multiple') {
      const selectedAnswers = value.map((answer) => answer.toString());
      const existingAnswers = question.correctAnswer || [];
      const newAnswers = [...existingAnswers, ...selectedAnswers];
      question.correctAnswer = newAnswers.filter((answer, index) => newAnswers.indexOf(answer) === index);
    } else {
      question.correctAnswer = value.toString()
    }
    setQuizUpdateInputlist(newQuestions);
  };

  async function updateGameInformation () {
    const quizid = updateQuizId;
    if (window.confirm(`Do you confirm update this game ${quizid} new?`)) {
      if (!quizUpdateInputlist || quizUpdateInputlist.length === 0) {
        message.error('Please add at least one question');
        return;
      }

      if (!questionInputNewName) {
        message.error('Please enter a game name');
        return;
      }
      const response = await fetch(`http://localhost:5005/admin/quiz/${quizid}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questions: quizUpdateInputlist,
          name: questionInputNewName,
          thumbnail: videoUrl || (imageUrl || imageLocal),
        }),
      });
      if (response.ok) {
        message.info('Update Game information successful 😊')
        navigate('/Dashboard')
      } else {
        message.error('You did not update successfully 😭 please try again ')
      }
    }
  }

  function backtolastpage () {
    window.history.back();
  }

  return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '400px' }}>
            <h1 style={{ textAlign: 'center' }}>Update Game New 😊</h1>
            <hr />
            <Form>
            <Form.Item>
                <Input placeholder="Enter new quiz name" value={questionInputNewName} onChange={(event) => setQuestionInputNewName(event.target.value)} />
            </Form.Item>
            <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => handleAddQuestion('single')} style={{ marginLeft: '20px', backgroundColor: '#d6e4ff' }} >Add Single Question</Button>
                <Button onClick={() => handleAddQuestion('multiple')} style={{ marginLeft: '20px', backgroundColor: '#d6e4ff' }}>Add Multiple Question</Button>
                <Button onClick={() => handleAddQuestion('short')} style={{ marginLeft: '20px', backgroundColor: '#d6e4ff' }}>Add short answer Question</Button>
            </div>
            </Form.Item>
            <hr />
            {quizUpdateInputlist?.map((question, index) => (
            <div key={index}>
            <p>You can set the correct answer though left circle </p>
                <Form.Item>
                    <Input placeholder={`Question ${index + 1}`} value={question.question} onChange={(event) => handleQuestionInputChange(index, event.target.value)} />
                </Form.Item>
                {question.type === 'single' && (
                    <div>
                        {question.answers.map((answer, answerIndex) => (
                            <Form.Item key={answerIndex}>
                                <Radio.Group onChange={(event) => handleCorrectAnswerChange(index, event.target.value)} value={question.correctAnswer}>
                                    <Radio value={answerIndex}>
                                        <Input placeholder={`Answer ${answerIndex + 1}`} value={answer} onChange={(event) => handleAnswerInputChange(index, answerIndex, event.target.value)} />
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        ))}
                    </div>
                )}
                {question.type === 'multiple' && (
                    <div>
                        <Checkbox.Group onChange={(checkedValues) => handleCorrectAnswerChange(index, checkedValues)} value={question.correctAnswer}>
                            {question.answers.map((answer, answerIndex) => (
                                <Form.Item key={answerIndex}>
                                    <Checkbox value={answerIndex}>
                                        <Input placeholder={`Answer ${answerIndex + 1}`} value={answer} onChange={(event) => handleAnswerInputChange(index, answerIndex, event.target.value)} />
                                    </Checkbox>
                                </Form.Item>
                            ))}
                        </Checkbox.Group>
                    </div>
                )}
                {question.type === 'short' && (
                <div>
                    <Form.Item>
                        <Input placeholder='input Answer' onChange={(event) => handleAnswerInputChange(index, '0', event.target.value) || handleCorrectAnswerChange(index, event.target.value)} />
                    </Form.Item>
                </div>)}
                {question.type && question.correctAnswer && (
                    <div>
                        <p>Correct answer: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}</p>
                    </div>
                )}
        <Form.Item>
            <Button type="primary" onClick={() => handleRemoveQuestion(index)}>Remove</Button>
        </Form.Item>
            </div>
            ))}
            <Form.Item>
            <br />
            <b>Image Update locally: {' '}</b>
            <div style={{ width: '200px', height: '200px' }} >
                <Input type="file" size="large" onChange={handleFileImageChange} />
                {imageLocal ? <img src={`data:image/png;base64,${imageLocal}`} alt="Uploaded file" style={{ width: '200px', height: '200px' }} /> : <img src={Imgsubmit} style={{ width: '200px', height: '200px' }} />}
            </div>
            </Form.Item>
            <Form.Item>
            <br />
            <b>Image URL Update: {' '}</b>
            <Input placeholder={'Input image HTTP website'} type="text" size="large" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </Form.Item>
            <Form.Item>
            <b>Video URL Update: {' '}</b>
            <Input placeholder={'Input video HTTP website'} type="text" size="large" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="outlined"
                    onClick={updateGameInformation}> 🔍 Update
                </Button>
                <Button variant="outlined" onClick={backtolastpage} style={{ marginLeft: '10px' }}> 👼 Return </Button>
            </div>
            </Form>
        </div>
        </div>
  );
}

export default UpdateQuiz;
