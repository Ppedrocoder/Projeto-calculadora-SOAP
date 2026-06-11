from spyne import Application, rpc, ServiceBase, Float, Fault
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
from wsgiref.simple_server import make_server

class CalculadoraService(ServiceBase):

    @rpc(Float, Float, _returns=Float)
    def somar(ctx, a, b):
        return a + b

    @rpc(Float, Float, _returns=Float)
    def multiplicar(ctx, a, b):
        return a * b
    
    @rpc(Float, Float, _returns=Float)
    def dividir(ctx, a, b):
        if b == 0:
            raise Fault("Client", "Divisão por zero não é permitida.")
        return a / b
    
    @rpc(Float, Float, _returns=Float)
    def subtrair(ctx, a, b):
        return a - b

application = Application(
    [CalculadoraService],
    tns='calculadora.soap',
    in_protocol=Soap11(validator='lxml'),
    out_protocol=Soap11(),
)

wsgi_app = WsgiApplication(application)

if __name__ == '__main__':
    print("API SOAP rodando em http://localhost:8000")
    print("WSDL disponível em http://localhost:8000/?wsdl")
    server = make_server('0.0.0.0', 8000, wsgi_app)
    server.serve_forever()
