#include <bits/stdc++.h>
using namespace std;

int N, K;
int conflict[13];  // conflict[i]: i와 사이가 나쁜 사람들의 비트마스크(1-based 비트)
vector<vector<int>> result;
vector<int> cur;

void go(int idx, int mask) {
    if ((int)cur.size() == K) {
        result.push_back(cur);
        return;
    }
    if (idx > N) return;
    // idx 를 넣는 경우를 먼저 봐야 사전순이 된다
    if (!(conflict[idx] & mask)) {
        cur.push_back(idx);
        go(idx + 1, mask | (1 << idx));
        cur.pop_back();
    }
    go(idx + 1, mask);
}

int main() {
    int M;
    cin >> N >> K >> M;
    for (int i = 0; i < M; i++) {
        int a, b;
        cin >> a >> b;
        conflict[a] |= 1 << b;
        conflict[b] |= 1 << a;
    }
    go(1, 0);
    cout << result.size() << '\n';
    for (auto &t : result) {
        for (size_t i = 0; i < t.size(); i++) cout << t[i] << (i + 1 == t.size() ? '\n' : ' ');
    }
    return 0;
}
