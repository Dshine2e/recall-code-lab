#include <bits/stdc++.h>
using namespace std;

int main() {
    string line, w, out;
    getline(cin, line);
    istringstream in(line);
    while (in >> w) { if (!out.empty()) out += '-'; out += w; }
    cout << out << '\n';
}
