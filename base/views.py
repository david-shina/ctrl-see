from django.shortcuts import render
from django.urls import reverse, reverse_lazy
from django.views.generic import CreateView, FormView, TemplateView, UpdateView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from .forms import TextDocumentForm
from .models import TextDocument
from django.http import HttpResponseRedirect
import pyttsx3
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.http import JsonResponse

# Create your views here.

class TextListView(ListView):
    # List all the text document
    model = TextDocument
    template_name = 'textList.html'
    paginate_by = 100


class TextDetailView(DetailView, FormView):

    model = TextDocument
    form_class = TextDocumentForm
    template_name = 'textDets.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = TextDocumentForm()
        return context
    
class TextCreateView(CreateView):
    model = TextDocument
    form_class = TextDocumentForm
    template_name = 'editor1.html'

    def get_success_url(self):
        return reverse_lazy("text-detail", kwargs={'pk': self.object.pk})

class TextUpdateView(UpdateView):
    model = TextDocument
    form_class = TextDocumentForm
    template_name = 'textDocCreate.html'  # Adjust template name

    def get_object(self, queryset = None):
        pk = self.kwargs.get('pk')
        return TextDocument.objects.get(pk=pk)  # Retrieve object for update
    
    def get_success_url(self):
        return reverse_lazy("text-detail", kwargs={'pk': self.object.pk})
    



class GetEditorView(TemplateView):
    template_name = "editor.html"
    extra_context = {"form": TextDocumentForm()}


@csrf_exempt
def textToSpeech(request, pk):
    
    try:
        text = TextDocument.objects.get(id=pk)
        content = text.text
    
        if not content:
            return HttpResponse('No Text available')

        engine = pyttsx3.init()

        voices = engine.getProperty('voices')
        engine.setProperty('rate', 125)
        engine.setProperty('voice', voices[1].id)

        engine.say(content)
        engine.runAndWait()
        
        return HttpResponseRedirect(request.META.get('HTTP_REFERER', request.path))
    
    except TextDocument.DoesNotExist:
        return HttpResponse('Text Document not found', status=404)
    
    except Exception as e:
        # Log the specific exception for debugging
        print(f"An error occurred: {e}")
        return HttpResponse(f'An error occurred: {e}', status=500)
    

@csrf_exempt
def pronunceByChar(request, pk):
    engine = pyttsx3.init()
    # try:
    #     document = get_object_or_404(TextDocument, pk=pk)
    # except:
    #     return 
    if request.method == 'POST':
        character = request.POST.get('character', '')

        if character:
            engine.say(character)
            engine.runAndWait()
        
        if character == ' ':
            word = request.session.get('current_word', '')
            if word:
                engine.say(word)
                engine.runAndWait()

            request.session['current_word'] = ''
        
    if character != ' ':
        request.session['current_word'] = request.session.get('current_word', '') + character

    return JsonResponse({'status' : 'success'})


