import json
from flask import Flask, request
import torch
import torchaudio
import subprocess
import requests

class GreedyCTCDecoder(torch.nn.Module):
    def __init__(self, labels, blank=0):
        super().__init__()
        self.labels = labels
        self.blank = blank

    def forward(self, emission: torch.Tensor) -> str:
        """Given a sequence emission over labels, get the best path string
        Args:
          emission (Tensor): Logit tensors. Shape `[num_seq, num_label]`.

        Returns:
          str: The resulting transcript
        """
        indices = torch.argmax(emission, dim=-1)  # [num_seq,]
        indices = torch.unique_consecutive(indices, dim=-1)
        indices = [i for i in indices if i != self.blank]
        return "".join([self.labels[i] for i in indices])

app = Flask(__name__)
@app.route('/', methods=['GET', 'POST'])
def run_model():
    raw_file = request.files.get('file')
    raw_file.save('audioj.bin')
    binary_file = 'audioj.bin'
    wav_file = 'speechj.wav'
   
    # raw-&gt;wav command
    cmd = "sox -t raw -r 48k -e signed -b 32 -L -c 1 " + binary_file + " " + wav_file
   
    # Execute command
    subprocess.check_output (cmd, shell = True)
   
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
   
       
    model = torch.load('model.pt').to(device)

    waveform, sample_rate = torchaudio.load(wav_file)

    waveform = torchaudio.functional.resample(waveform, sample_rate, 16000)
   
    waveform = waveform.to(device)
   
    waveform = waveform * 10
   
    with torch.inference_mode():
        emission, _ = model(waveform)
   
    decoder = GreedyCTCDecoder(labels=[' ', ' ', ' ', ' ', ' ', 'E', 'T', 'A', 'O', 'N', 'I', 'H', 'S', 'R', 'D', 'L', 'U', 'M', 'W', 'C', 'F', 'G', 'Y', 'P', 'B', 'V', 'K', "'", 'X', 'J', 'Q', 'Z'])
    transcript = decoder(emission[0])
    print(transcript)
   
    url = 'http://107.22.249.15:8080/voice/'
    myobj = {'data': transcript}
   
    x = requests.post(url, data = myobj)

    return x.text
   
app.run(host="169.254.238.233")