
export const transcribeAudio = async (audioBlob: Blob, apiKey: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');

  try {
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Whisper API Failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Whisper Error:', error);
    throw error;
  }
};
