#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, k;
    cin >> n >> k;
    deque<int> d;
    for (int i = 1; i <= n; i++) d.push_back(i);
    if (n > 0) for (int i = 0; i < k % n; i++) { d.push_front(d.back()); d.pop_back(); }
    for (int i = 0; i < n; i++) cout << (i ? " " : "") << d[i];
    cout << '\n';
}
