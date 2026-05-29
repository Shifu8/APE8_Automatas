# Autor: Jara
# Descripción: Funciones auxiliares para crear nodos del árbol sintáctico.


def create_node(name, value=None, children=None):
    node = {"name": name}

    if value is not None:
        node["value"] = value

    if children:
        node["children"] = children

    return node
