FROM public.ecr.aws/lambda/python:3.8


ENV NUMBA_CACHE_DIR /tmp
RUN pip install rembg -t .
RUN rm rembg/detect.py
RUN rm gdown/download.py
COPY detect.py rembg/detect.py
COPY download.py gdown/download.py
COPY index.py index.py
CMD ["index.lambda_handler"]